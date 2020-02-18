import sys 
import helpers
import cv2 # note: activate vanilla on server
import os

imagepath = r'..\public\pedestrian'

# send bbox through UI
left = float(sys.argv[1])
top = float(sys.argv[2])
width = float(sys.argv[3])
height = float(sys.argv[4])
# send framenumber from UI
i =  int(sys.argv[5])

#print(os.getcwd())
bbox = [left,top,width,height]

# select tracker_type 
tracker_types = ['CSRT']

# bbox = cv2.selectROI(frame, False)

# resize frame 
#frame = imutils.resize(frame, width=600)

for tracker_type in tracker_types:

    # Initialize tracker with first frame and bounding box
    if tracker_type == 'BOOSTING': # 0
        tracker = cv2.TrackerBoosting_create()
    if tracker_type == 'MIL': # 1            
        tracker = cv2.TrackerMIL_create()
    if tracker_type == 'KCF': # 2            
        tracker = cv2.TrackerKCF_create()
    if tracker_type == 'TLD': # 3            
        tracker = cv2.TrackerTLD_create()
    if tracker_type == 'MEDIANFLOW': # 4
        tracker = cv2.TrackerMedianFlow_create()
    if tracker_type == 'GOTURN': # 5
        tracker = cv2.TrackerGOTURN_create()
    if tracker_type == 'MOSSE': # 6
        tracker = cv2.TrackerMOSSE_create()
    if tracker_type == "CSRT": # 7
        tracker = cv2.TrackerCSRT_create()

    num_imgs = helpers.count_files(imagepath,'jpg') 

    if (i <= num_imgs): 
        # get first non-zero entry of ground truth
        bbox = tuple(bbox)
        print(str(bbox[0]) + "," + str(bbox[1]) + "," + str(bbox[2]) + "," + str(bbox[3]))

        if not os.path.exists(os.path.join(imagepath,'output')):
            os.mkdir(os.path.join(imagepath,'output'))

        #output_file = open(os.path.join(imagepath,'output','output_'+tracker_type+'.txt'),'w') 
        #output_file.write('%d %d %d %d\n' % bbox)

        # Read first frame
        frame = cv2.imread(os.path.join(
            imagepath, "%08d" % (i+1)+'.jpg')) # +1 because image names start at 00000001.jpg

        ok = tracker.init(frame, bbox)

        count = i+1 
        failureDetected = False
        while count < num_imgs and failureDetected == False:
            # Read a new frame
            frame = cv2.imread(os.path.join(
                imagepath, "%08d" % (count+1)+'.jpg')) # +1 because image names start at 00000001.jpg

            # Update tracker
            ok, bbox = tracker.update(frame) 

            if ok:
                # Tracking success
                #output_file.write('%d %d %d %d\n' % bbox)
                print(str(bbox[0]) + "," + str(bbox[1]) + "," + str(bbox[2]) + "," + str(bbox[3]))
            else:
                #output_file.write('%d %d %d %d\n' % bbox)
                #print(str(bbox[0]) + "," + str(bbox[1]) + "," + str(bbox[2]) + "," + str(bbox[3]))
                failureDetected = True

            count += 1
        #output_file.close()


# send input back to nodejs
sys.stdout.flush()

