# SIH Cyclone Monitoring System — Prototype

A cyclone detection, classification, and early-warning system prototype built for [SIH round name]. Uses satellite imagery and CNN-based classification to identify cyclone intensity, with a dashboard for public and authority use.

## Project Structure
├── ml-model/ — CNN classification pipeline (ResNet50 + Grad-CAM)
│ ├── cyclone_cnn_gradcam.ipynb
│ ├── gradcam_samples/
│ └── README.md
├── Cyclone/ — React frontend dashboard
│ ├── src/
│ └── README.md


## What's Built (Prototype Scope)
- **CNN classifier**: fine-tuned ResNet50 on INSAT-3D infrared satellite imagery, classifying cyclone severity into 3 tiers (Low/Moderate/High). See `ml-model/README.md`.
- **Grad-CAM explainability**: visual validation of what the model attends to when classifying.
- **Frontend dashboard**: React UI with map view, cyclone info panel, and authority-only views. See `Cyclone/README.md`.

## What's Not Yet Integrated
- Frontend ↔ model backend connection (Express/FastAPI API layer)
- GRU-based track/intensity prediction (6–24hr forecast)
- Live wind/scatterometer and population density data sources
- Rapid Scan tasking workflow

## Full System Architecture (Target)
Multi-source satellite + wind data
→ CNN (detection + classification)
→ Grad-CAM (explainability validation)
→ GRU (track/intensity prediction)
→ Python model service (FastAPI/Flask)
→ Express backend API
→ React dashboard

With a parallel path flagging disturbances for IMD/ISRO Rapid Scan coordination.

## Known Limitations (Prototype)
- Trained on 136 publicly available sample images (Kaggle subset) — small dataset limits classification accuracy (~40-45% validation) and causes some majority-class bias, confirmed via confusion matrix analysis
- Frontend currently runs on mock data, not live model output
- This is a scoped-down proof-of-concept; production deployment requires IMD's full operational multi-channel archive and the complete pipeline above

## Team rOYAI
[Members]

[Paavni Sarmandal]
[Meghna M Nambiar]
[Potharaju Pranav]
[Jeevitha K J]
[Naramsetti Hasini]
[Neal Saraswat]
