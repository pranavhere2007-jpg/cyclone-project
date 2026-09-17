import os
import numpy as np
import h5py

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

IMAGE_SIZE = 128

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using:", DEVICE)


# ============================================================
# LOAD LABELS
# ============================================================

labels = np.load(
    LABEL_FILE,
    allow_pickle=True
)

print("Total images:", len(labels))


# Label format:
#
# 0 = basin
# 1 = cyclone ID
# 2 = longitude
# 3 = latitude
# 4 = timestamp
# 5 = wind speed
# 6 = another field
# 7 = pressure
#

cyclone_ids = labels[:, 1].astype(str)
wind_speeds = labels[:, 5].astype(float)


# ============================================================
# CONVERT WIND SPEED TO LOW / MEDIUM / HIGH
# ============================================================

def wind_to_class(wind):
    """
    0 = LOW
    1 = MEDIUM
    2 = HIGH
    """

    if wind < 50:
        return 0

    elif wind < 85:
        return 1

    else:
        return 2


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
# SHOW CLASS DISTRIBUTION
# ============================================================

print("\nClass distribution:")

for i, name in enumerate(class_names):

    count = np.sum(classes == i)

    percentage = (
        count / len(classes) * 100
    )

    print(
        f"{name}: "
        f"{count} images "
        f"({percentage:.2f}%)"
    )


# ============================================================
# SPLIT BY CYCLONE
# ============================================================

# This is important.
#
# Images belonging to the same cyclone are very similar.
# We therefore keep entire cyclones together.

unique_cyclones = np.unique(cyclone_ids)

print(
    "\nUnique cyclones:",
    len(unique_cyclones)
)


# Shuffle cyclone IDs

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

print(
    "Train:",
    len(train_indices),
    "images /",
    len(train_cyclones),
    "cyclones"
)

print(
    "Validation:",
    len(val_indices),
    "images /",
    len(val_cyclones),
    "cyclones"
)

print(
    "Test:",
    len(test_indices),
    "images /",
    len(test_cyclones),
    "cyclones"
)


# ============================================================
# DATASET
# ============================================================

class CycloneDataset(Dataset):

    def __init__(
        self,
        image_file,
        labels,
        indices,
        training=False
    ):

        self.image_file = image_file
        self.labels = labels
        self.indices = indices
        self.training = training

        self.h5_file = None


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
        # Read image
        # ----------------------------------------------------

        image = self.images[
            real_index
        ]

        # Image shape:
        #
        # 128 x 128 x 4
        #
        # We only use:
        #
        # channel 0 = IR
        # channel 1 = Water Vapor
        # channel 2 = Visible
        #
        # Ignore channel 3 = Passive Microwave

        image = image[:, :, :3]

        # Convert to float
        image = image.astype(
            np.float32
        )

        # Normalize 0-255 -> 0-1

        image /= 255.0

        # HWC -> CHW

        image = np.transpose(
            image,
            (2, 0, 1)
        )

        image = torch.tensor(
            image,
            dtype=torch.float32
        )


        # ----------------------------------------------------
        # Simple augmentation
        # ----------------------------------------------------

        if self.training:

            # Random horizontal flip

            if np.random.random() < 0.5:

                image = torch.flip(
                    image,
                    dims=[2]
                )

            # Random vertical flip

            if np.random.random() < 0.5:

                image = torch.flip(
                    image,
                    dims=[1]
                )


        # ----------------------------------------------------
        # Label
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
# CREATE DATASETS
# ============================================================

train_dataset = CycloneDataset(
    IMAGE_FILE,
    labels,
    train_indices,
    training=True
)

val_dataset = CycloneDataset(
    IMAGE_FILE,
    labels,
    val_indices,
    training=False
)

test_dataset = CycloneDataset(
    IMAGE_FILE,
    labels,
    test_indices,
    training=False
)


# ============================================================
# DATA LOADERS
# ============================================================

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


# ============================================================
# CNN
# ============================================================

class CycloneCNN(nn.Module):

    def __init__(self):

        super().__init__()

        self.features = nn.Sequential(

            # 128 x 128

            nn.Conv2d(
                3,
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


        # Instead of calculating the exact
        # flattened size, use adaptive pooling.

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
# MODEL
# ============================================================

model = CycloneCNN().to(DEVICE)

print("\nModel:")
print(model)


# ============================================================
# CLASS WEIGHTS
# ============================================================

# Calculate training class frequencies.

train_classes = classes[
    train_indices
]

class_counts = np.bincount(
    train_classes,
    minlength=3
)

print("\nTraining class counts:")
print(class_counts)


# Give rarer classes more importance.

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

print(
    "Class weights:",
    class_weights
)


# ============================================================
# LOSS + OPTIMIZER
# ============================================================

criterion = nn.CrossEntropyLoss(
    weight=class_weights
)

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=LEARNING_RATE
)


# ============================================================
# TRAINING FUNCTION
# ============================================================

def run_epoch(
    loader,
    training
):

    if training:
        model.train()

    else:
        model.eval()


    total_loss = 0.0

    total_correct = 0

    total_samples = 0


    for images, targets in loader:

        images = images.to(DEVICE)
        targets = targets.to(DEVICE)


        if training:

            optimizer.zero_grad()


        with torch.set_grad_enabled(
            training
        ):

            outputs = model(
                images
            )

            loss = criterion(
                outputs,
                targets
            )


            if training:

                loss.backward()

                optimizer.step()


        total_loss += (
            loss.item() *
            images.size(0)
        )


        predictions = torch.argmax(
            outputs,
            dim=1
        )


        total_correct += (
            predictions == targets
        ).sum().item()


        total_samples += (
            images.size(0)
        )


    average_loss = (
        total_loss /
        total_samples
    )

    accuracy = (
        total_correct /
        total_samples
    )


    return average_loss, accuracy


# ============================================================
# TRAIN
# ============================================================

best_val_accuracy = 0.0


print("\nStarting training...\n")


for epoch in range(EPOCHS):

    train_loss, train_accuracy = run_epoch(
        train_loader,
        training=True
    )

    val_loss, val_accuracy = run_epoch(
        val_loader,
        training=False
    )


    print(
        f"Epoch "
        f"{epoch + 1:02d}/{EPOCHS} | "
        f"Train Loss: {train_loss:.4f} | "
        f"Train Acc: {train_accuracy:.4f} | "
        f"Val Loss: {val_loss:.4f} | "
        f"Val Acc: {val_accuracy:.4f}"
    )


    # Save best model

    if val_accuracy > best_val_accuracy:

        best_val_accuracy = val_accuracy

        torch.save(
            model.state_dict(),
            "best_cyclone_model.pth"
        )


print(
    "\nBest validation accuracy:",
    best_val_accuracy
)


# ============================================================
# TEST
# ============================================================

model.load_state_dict(
    torch.load(
        "best_cyclone_model.pth",
        map_location=DEVICE
    )
)

test_loss, test_accuracy = run_epoch(
    test_loader,
    training=False
)


print("\n==============================")
print("FINAL TEST RESULTS")
print("==============================")

print(
    f"Test Loss: {test_loss:.4f}"
)

print(
    f"Test Accuracy: "
    f"{test_accuracy * 100:.2f}%"
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

confusion = np.zeros(
    (3, 3),
    dtype=np.int64
)


model.eval()


with torch.no_grad():

    for images, targets in test_loader:

        images = images.to(DEVICE)

        outputs = model(
            images
        )

        predictions = torch.argmax(
            outputs,
            dim=1
        ).cpu().numpy()

        targets = targets.numpy()


        for actual, predicted in zip(
            targets,
            predictions
        ):

            confusion[
                actual,
                predicted
            ] += 1


print("\nConfusion matrix:")
print()

print(
    "             LOW  MEDIUM  HIGH"
)

for i, name in enumerate(
    class_names
):

    print(
        f"{name:8s} "
        f"{confusion[i, 0]:5d} "
        f"{confusion[i, 1]:7d} "
        f"{confusion[i, 2]:6d}"
    )


# ============================================================
# PRECISION / RECALL / F1
# ============================================================

print("\nClass metrics:")

for i, name in enumerate(
    class_names
):

    true_positive = confusion[
        i, i
    ]

    false_positive = (
        confusion[:, i].sum()
        - true_positive
    )

    false_negative = (
        confusion[i, :].sum()
        - true_positive
    )


    precision = (
        true_positive /
        max(
            true_positive +
            false_positive,
            1
        )
    )

    recall = (
        true_positive /
        max(
            true_positive +
            false_negative,
            1
        )
    )

    f1 = (
        2 *
        precision *
        recall /
        max(
            precision + recall,
            1e-8
        )
    )


    print(
        f"{name}: "
        f"Precision={precision:.3f}, "
        f"Recall={recall:.3f}, "
        f"F1={f1:.3f}"
    )


# ============================================================
# SINGLE IMAGE PREDICTION
# ============================================================

def predict_image(
    image_index
):

    model.eval()

    with h5py.File(
        IMAGE_FILE,
        "r"
    ) as f:

        image = f["Images"][
            image_index
        ]

    # Use IR + WV + Visible

    image = image[:, :, :3]

    image = image.astype(
        np.float32
    )

    image /= 255.0

    image = np.transpose(
        image,
        (2, 0, 1)
    )

    image = torch.tensor(
        image,
        dtype=torch.float32
    ).unsqueeze(0)

    image = image.to(DEVICE)


    with torch.no_grad():

        output = model(
            image
        )

        probabilities = torch.softmax(
            output,
            dim=1
        )[0]

        prediction = torch.argmax(
            probabilities
        ).item()


    print("\nPrediction:")
    print(
        class_names[prediction]
    )

    print("\nProbabilities:")

    for i, name in enumerate(
        class_names
    ):

        print(
            f"{name}: "
            f"{probabilities[i].item() * 100:.2f}%"
        )


    return class_names[prediction]


# ============================================================
# EXAMPLE
# ============================================================

# predict_image(0)