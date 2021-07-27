# NBA Wizard

### Goal

Predict with reasonable accuracy whether a basketball shot will go in.

The program should be able to predict, given a video stream of an NBA game, whether a shot attempt will be successful. 

## Implementation

The program will use the location of the basketball on video, and the location of the hoop on video, 
over a given time frame to continuously update its prediction on whether or not the shot will be successful.

It will *not* use historical player statistics for prediction. Ideally, a prediction for a certain player's shot 
will be independent of the player themselves. Instead, it will use neural networks to intelligently decide.

### Features

For each video frame, these will be the features that will be either inputted during training or outputted during inference:

1. Location of basketball in frame (bounding box)
2. Location of hoop in frame (bounding box)
3. Location of backboard in frame (bounding box)
4. Whether the current frame is part of a shot attempt or not
5. If current frame is a shot attempt, whether the shot attempt is successful

### Architecture

1. Objects in the frame will first be detected and localized using a fine-tuned YOLOv5.

possible modification to be made: instead of detecting relevant objects, instead feed into CNN to extract feature map and
use that instead. this may be a better option as less work is required from a human to label objects in a frame

2. Locations of the objects in the frame will be fed into another network that will determine if the frame is
part of a shot attempt.

possible modification to be made: if the frame is indeed contain a shot attempt or part of a shot attempt, we assume that the next 1
second or so are also shot attempt frames. This may reap computation speedups, but lose out on precision, due to the possibility of overestimating.

3. If the frame is part of a shot attempt, feed frame into a CNN-RNN that takes into account previous shot attempt frames (if any) that outputs the probability
of a successful shot attempt.
