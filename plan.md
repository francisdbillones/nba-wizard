# NBA Wizard

### Goal

Predict with reasonable accuracy whether a basketball shot will go in.

The program should be able to predict, given a video stream of an NBA game, whether a shot attempt will be successful. 

## Implementation

The program will use the location of the basketball on video, and the location of the hoop on video, over a given time frame to continuously update its prediction on whether or not the shot will be successful.

It will *not* use historical player statistics for prediction. Ideally, a prediction for a certain player's shot will be independent of the player themselves. Instead, it will use neural networks to intelligently decide.

### Features

For each video frame, these will be the features that will be either inputted during training or outputted during inference:

1. Location of basketball in frame (bounding box)
2. Location of hoop in frame (bounding box)
3. Whether the current frame is part of a shot attempt or not
4. If current frame is a shot attempt, whether or not the shot attempt is successful