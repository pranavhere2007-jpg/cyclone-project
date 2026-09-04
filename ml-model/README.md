# Cyclone Intensity Classification — CNN Prototype

## Overview
Prototype model for classifying cyclone intensity from INSAT-3D infrared satellite imagery, built as a proof-of-concept for the end-to-end cyclone monitoring pipeline (see root README for full architecture). Fine-tunes a ResNet50 backbone and uses Grad-CAM for visual explainability.

## Dataset
- Source: [INSAT-3D Cyclone Dataset (Kaggle)](https://www.kaggle.com/) — public dataset, not included in this repo due to size
- 136 infrared satellite images, labeled with wind speed (knots) via accompanying CSV
- Wind speeds bucketed into 3 simplified severity tiers for this prototype:
  - **Low** (Depression + Cyclonic Storm, <48 kt)
  - **Moderate** (Severe Cyclonic Storm, 48–63 kt)
  - **High** (Very Severe Cyclonic Storm and above, 64+ kt)
- Class distribution: Low (50), Moderate (41), High (45)

> **Note:** Production system will use the full 6-tier IMD intensity scale (Depression → Super Cyclonic Storm) trained on IMD's operational multi-channel INSAT-3D archive (IR + water vapor + visible), not this 3-tier public subset.

## Model
- **Architecture:** ResNet50 (ImageNet pretrained), last 5 layers unfrozen and fine-tuned; custom classification head (GlobalAveragePooling → Dense(128) → Dropout(0.3) → Dense(3, softmax))
- **Training:** Adam optimizer (lr=1e-5), class-weighted loss to address imbalance, early stopping on validation loss
- **Input:** 224×224 IR imagery, single channel replicated to RGB

## Results
- **Validation accuracy:** ~40–45% (across multiple runs; see notebook for full figures)
- **Known limitation:** Confusion matrix analysis shows majority-class bias — model does not yet cleanly discriminate all 3 classes, consistent with the small per-class sample size (41–50 images). This is a data scarcity issue, not an architectural one. See `gradcam_samples/` for full confusion matrix and training curves.

## Explainability (Grad-CAM)
Grad-CAM overlays generated for one sample per class to visually validate model attention against real cyclone structure (spiral bands, eye formation). See `gradcam_samples/`.

## Files
- `cyclone_cnn_gradcam.ipynb` — full pipeline: data prep, training, evaluation, Grad-CAM
- `gradcam_samples/` — Grad-CAM overlay images, training curves, confusion matrix

## Next Steps for Production
- Scale training data via IMD's operational archive (1000+ samples/class target)
- Multi-channel input (IR + water vapor + visible)
- Data augmentation tuned for satellite imagery domain (current attempt with generic photo augmentation degraded performance — needs domain-specific approach)
- Full 6-tier IMD classification scale
