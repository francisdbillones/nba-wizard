# NBA Wizard

## Goal

Predict with reasonable accuracy whether a basketball shot will go in.

The program should be able to predict, given a video stream of an NBA game, whether a shot attempt will be successful. 

It should *not* use historical player statistics for prediction. Tools for this kind of projection based on historical data already exist. Instead, a prediction for a certain player's shot should be independent of the player themselves. It will ideally use factors like the trajectory of the ball.

## Event detector
A simple LSTM will be used to detect events in the video, such as "Successful 3 point shot" or "Failed 3 point shot". Features produced from the frame processor will be fed into the LSTM.

## Frame processor
Features need to processed from the frame to fed into the LSTM.

### **Proposal 1**: Basic CNN

The raw frame will be fed into a CNN and the resulting feature map will be plugged into the event detector.

**Pros**:

- Less human labor is required as less data needs to be labeled

**Cons**:

- May be less accurate
- May pick up features that we don't want; (flagging tumor on existence of ruler)

### **Proposal 2**: YOLO

The raw frame will be fed into YOLO to produce bounding boxes for relevant objects such as the basketball, hoop, etc.

**Pros**:

- May be more accurate

**Cons**:

- More human labor is required as more data needs to be labeled
- Features are controlled