# NBA Wizard

### Goal

Predict with reasonable accuracy whether a basketball shot will go in.

The program should be able to predict, given a video stream of an NBA game, whether a shot attempt will be successful. 

## Implementation

The program will use the location of the basketball on video, and the location of the hoop on video, 
over a given time frame to continuously update its prediction on whether or not the shot will be successful.

It will *not* use historical player statistics for prediction. Ideally, a prediction for a certain player's shot 
will be independent of the player themselves. Instead, it will use neural networks to intelligently decide.

### Architecture

#### Proposal 1: RNN-CNN
- Each frame will be fed into a CNN to produce a feature map
- The produced feature map will be fed into an LSTM to produce probability of success.

Pros:
- Less human labor required to label data

Cons:
- May be less accurate

#### Proposal 2: YOLO-RNN
- Each frame will be fed into a fine-tuned YOLO to produce relevant object locations
- Object locations will be fed into an LSTM to produce probability of success.

Pros:
- May be more accurate

Cons:
- More human labor required to label data
