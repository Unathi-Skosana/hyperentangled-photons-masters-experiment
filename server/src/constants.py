ENC_CNT = 1919.64  # 1 / deg
VEL_SCALE = 42941.66  # deg / s
ACCEL_SCALE = 14.66  # deg / s^2

# on the z basis translational stage
TRANS_STAGE =  17.872 # 1 mm  on the translational stage

## 18mm

# z basis projections translational stage (absolute positions)
PROJ_ONE_POS = 500.416 
PROJ_ZERO_POS = 0
PROJ_BOTH_POS = 250.208

## Projector angles
ANGLES = {
    # [HWP, QWP]
    "0": [0, 0],
    "1": [45, 0],
    "+": [22.5, 45],
    "-": [-22.5, 45],
    "i": [22.5, 0],
    "-i": [-22.5, 0],
}
