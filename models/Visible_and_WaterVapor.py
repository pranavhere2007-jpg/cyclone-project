import h5py
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader


# ============================================================
# SETTINGS
# ============================================================

IMAGE_FILE = r"E:\Coding\SIH\archive\Cyclone_Images.h5"
LABEL_FILE = r"E:\Coding\SIH\archive\Cyclone_Labels h5.npy"

BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 0.001

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", DEVICE)


# ============================================================
# LOAD LABELS
# ============================================================

labels = np.load(
    LABEL_FILE,
    allow_pickle=True
)

cyclone_ids = labels[:, 1].astype(str)
wind_speeds = labels[:, 5].astype(float)


# ============================================================
# LOW / MEDIUM / HIGH
# ============================================================

def wind_to_class(wind):

    if wind < 50:
        return 0       # LOW

    elif wind < 85:
        return 1       # MEDIUM

    else:
        return 2       # HIGH


classes = np.array([
    wind_to_class(w)
    for w in wind_speeds
])


class_names = [
    "LOW",
    "MEDIUM",
    "HIGH"
]


# ============================================================
# SPLIT BY CYCLONE
# ============================================================

unique_cyclones = np.unique(
    cyclone_ids
)

rng = np.random.default_rng(42)

rng.shuffle(unique_cyclones)


train_count = int(
    len(unique_cyclones) * 0.70
)

val_count = int(
    len(unique_cyclones) * 0.15
)


train_cyclones = set(
    unique_cyclones[:train_count]
)

val_cyclones = set(
    unique_cyclones[
        train_count:
        train_count + val_count
    ]
)

test_cyclones = set(
    unique_cyclones[
        train_count + val_count:
    ]
)


train_indices = np.array([
    i for i, c in enumerate(cyclone_ids)
    if c in train_cyclones
])

val_indices = np.array([
    i for i, c in enumerate(cyclone_ids)
    if c in val_cyclones
])

test_indices = np.array([
    i for i, c in enumerate(cyclone_ids)
    if c in test_cyclones
])


print("\nDataset split:")
print("Train:", len(train_indices))
print("Validation:", len(val_indices))
print("Test:", len(test_indices))


# ============================================================
# DATASET
# ============================================================

class SingleChannelDataset(Dataset):

    def __init__(
        self,
        image_file,
        labels,
        indices,
        channel,
        training=False
    ):

        self.image_file = image_file
        self.labels = labels
        self.indices = indices
        self.channel = channel
        self.training = training

        self.h5_file = None
        self.images = None


    def _open_file(self):

        if self.h5_file is None:

            self.h5_file = h5py.File(
                self.image_file,
                "r"
            )

            self.images = self.h5_file["Images"]


    def __len__(self):

        return len(self.indices)


    def __getitem__(self, index):

        self._open_file()

        real_index = self.indices[index]

        # ----------------------------------------------------
        # Get ONE channel
        # ----------------------------------------------------

        image = self.images[
            real_index,
            :,
            :,
            self.channel
        ]

        image = image.astype(
            np.float32
        )

        image /= 255.0

        # 128 x 128 -> 1 x 128 x 128

        image = np.expand_dims(
            image,
            axis=0
        )

        image = torch.tensor(
            image,
            dtype=torch.float32
        )


        # ----------------------------------------------------
        # Augmentation
        # ----------------------------------------------------

        if self.training:

            if np.random.random() < 0.5:

                image = torch.flip(
                    image,
                    dims=[2]
                )

            if np.random.random() < 0.5:

                image = torch.flip(
                    image,
                    dims=[1]
                )


        # ----------------------------------------------------
        # Target
        # ----------------------------------------------------

        wind = float(
            self.labels[
                real_index,
                5
            ]
        )

        target = wind_to_class(
            wind
        )

        target = torch.tensor(
            target,
            dtype=torch.long
        )

        return image, target


# ============================================================
# CNN
# ============================================================

class SingleChannelCNN(nn.Module):

    def __init__(self):

        super().__init__()

        self.features = nn.Sequential(

            # 128 x 128

            nn.Conv2d(
                1,
                32,
                kernel_size=3,
                padding=1
            ),

            nn.BatchNorm2d(32),

            nn.ReLU(),

            nn.MaxPool2d(2),


            # 64 x 64

            nn.Conv2d(
                32,
                64,
                kernel_size=3,
                padding=1
            ),

            nn.BatchNorm2d(64),

            nn.ReLU(),

            nn.MaxPool2d(2),


            # 32 x 32

            nn.Conv2d(
                64,
                128,
                kernel_size=3,
                padding=1
            ),

            nn.BatchNorm2d(128),

            nn.ReLU(),

            nn.MaxPool2d(2),


            # 16 x 16

            nn.Conv2d(
                128,
                256,
                kernel_size=3,
                padding=1
            ),

            nn.BatchNorm2d(256),

            nn.ReLU(),

            nn.MaxPool2d(2)

        )


        self.pool = nn.AdaptiveAvgPool2d(
            (1, 1)
        )


        self.classifier = nn.Sequential(

            nn.Flatten(),

            nn.Linear(
                256,
                128
            ),

            nn.ReLU(),

            nn.Dropout(0.4),

            nn.Linear(
                128,
                3
            )

        )


    def forward(self, x):

        x = self.features(x)

        x = self.pool(x)

        x = self.classifier(x)

        return x


# ============================================================
# TRAIN ONE MODEL
# ============================================================

def train_model(
    channel,
    model_name
):

    print("\n")
    print("=" * 60)
    print("TRAINING:", model_name)
    print("=" * 60)


    # --------------------------------------------------------
    # Dataset
    # --------------------------------------------------------

    train_dataset = SingleChannelDataset(
        IMAGE_FILE,
        labels,
        train_indices,
        channel,
        training=True
    )

    val_dataset = SingleChannelDataset(
        IMAGE_FILE,
        labels,
        val_indices,
        channel,
        training=False
    )

    test_dataset = SingleChannelDataset(
        IMAGE_FILE,
        labels,
        test_indices,
        channel,
        training=False
    )


    # --------------------------------------------------------
    # DataLoader
    # --------------------------------------------------------

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0
    )


    # --------------------------------------------------------
    # Model
    # --------------------------------------------------------

    model = SingleChannelCNN().to(
        DEVICE
    )


    # --------------------------------------------------------
    # Class weights
    # --------------------------------------------------------

    train_classes = classes[
        train_indices
    ]

    class_counts = np.bincount(
        train_classes,
        minlength=3
    )

    class_weights = (
        len(train_classes)
        /
        (
            3 *
            class_counts
        )
    )

    class_weights = torch.tensor(
        class_weights,
        dtype=torch.float32,
        device=DEVICE
    )


    criterion = nn.CrossEntropyLoss(
        weight=class_weights
    )


    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=LEARNING_RATE
    )


    # --------------------------------------------------------
    # Training
    # --------------------------------------------------------

    best_val_accuracy = 0.0


    for epoch in range(EPOCHS):

        # ================================================
        # TRAIN
        # ================================================

        model.train()

        train_correct = 0
        train_total = 0
        train_loss = 0


        for images, targets in train_loader:

            images = images.to(DEVICE)
            targets = targets.to(DEVICE)

            optimizer.zero_grad()

            outputs = model(images)

            loss = criterion(
                outputs,
                targets
            )

            loss.backward()

            optimizer.step()


            train_loss += (
                loss.item() *
                images.size(0)
            )

            predictions = torch.argmax(
                outputs,
                dim=1
            )

            train_correct += (
                predictions == targets
            ).sum().item()

            train_total += (
                images.size(0)
            )


        train_loss /= train_total

        train_accuracy = (
            train_correct /
            train_total
        )


        # ================================================
        # VALIDATION
        # ================================================

        model.eval()

        val_correct = 0
        val_total = 0
        val_loss = 0


        with torch.no_grad():

            for images, targets in val_loader:

                images = images.to(DEVICE)
                targets = targets.to(DEVICE)

                outputs = model(images)

                loss = criterion(
                    outputs,
                    targets
                )

                val_loss += (
                    loss.item() *
                    images.size(0)
                )

                predictions = torch.argmax(
                    outputs,
                    dim=1
                )

                val_correct += (
                    predictions == targets
                ).sum().item()

                val_total += (
                    images.size(0)
                )


        val_loss /= val_total

        val_accuracy = (
            val_correct /
            val_total
        )


        print(
            f"Epoch {epoch + 1:02d}/{EPOCHS} | "
            f"Train Acc: "
            f"{train_accuracy * 100:.2f}% | "
            f"Val Acc: "
            f"{val_accuracy * 100:.2f}%"
        )


        # Save best model

        if val_accuracy > best_val_accuracy:

            best_val_accuracy = val_accuracy

            torch.save(
                model.state_dict(),
                model_name
            )


    # --------------------------------------------------------
    # TEST
    # --------------------------------------------------------

    model.load_state_dict(
        torch.load(
            model_name,
            map_location=DEVICE
        )
    )

    model.eval()

    test_correct = 0
    test_total = 0


    with torch.no_grad():

        for images, targets in test_loader:

            images = images.to(DEVICE)
            targets = targets.to(DEVICE)

            outputs = model(images)

            predictions = torch.argmax(
                outputs,
                dim=1
            )

            test_correct += (
                predictions == targets
            ).sum().item()

            test_total += (
                images.size(0)
            )


    test_accuracy = (
        test_correct /
        test_total
    )


    print()
    print(
        model_name,
        "TEST ACCURACY:",
        f"{test_accuracy * 100:.2f}%"
    )


    return model


# ============================================================
# TRAIN WATER VAPOR MODEL
# ============================================================

# Dataset channel 1 = Water Vapor

train_model(
    channel=1,
    model_name="water_vapor_model.pth"
)


# ============================================================
# TRAIN VISIBLE MODEL
# ============================================================

# Dataset channel 2 = Visible

train_model(
    channel=2,
    model_name="visible_model.pth"
)


print("\n")
print("=" * 60)
print("DONE")
print("=" * 60)

print(
    "Saved:"
)

print(
    "water_vapor_model.pth"
)

print(
    "visible_model.pth"
)