import cv2
import os
import helpers


if __name__ == '__main__':

    basepath = r'images'

    # Set up tracker
    # 8 types of trackers

    # TODO select tracker_type through UI
    # TODO select video through UI

    tracker_types = ['BOOSTING']
    tracker_types = ['BOOSTING','MIL','KCF', 'TLD', 'MEDIANFLOW', 'GOTURN', 'MOSSE', 'CSRT']
    # iterate list of sequences
    #listfile = open(os.path.join(basepath, 'list.txt'), "r")

    #for display_idx, display in enumerate(listfile):
        #display = helpers.display_idx_to_diplay(display_idx, basepath)
        display = basepath
        for tracker_type in tracker_types:
            print('display_idx')
            print(display_idx)
            print(tracker_type)

            # Initialize tracker with first frame and bounding box
            if tracker_type == 'BOOSTING':  # 0
                tracker = cv2.TrackerBoosting_create()
            if tracker_type == 'MIL':  # 1            
                tracker = cv2.TrackerMIL_create()
            if tracker_type == 'KCF':  # 2            
                tracker = cv2.TrackerKCF_create()
            if tracker_type == 'TLD':  # 3            
                tracker = cv2.TrackerTLD_create()
            if tracker_type == 'MEDIANFLOW':  # 4
                tracker = cv2.TrackerMedianFlow_create()
            if tracker_type == 'GOTURN':  # 5
                tracker = cv2.TrackerGOTURN_create()
            if tracker_type == 'MOSSE':  # 6
                tracker = cv2.TrackerMOSSE_create()
            if tracker_type == "CSRT":  # 7
                tracker = cv2.TrackerCSRT_create()

            display = display.rstrip()
            diplay_path = os.path.join(basepath, display)
            num_imgs = helpers.count_files(diplay_path,'jpg')

            # Define an initial bounding box
            # read ground truth for first frame
            # get groundtruth

            if 'BirdData' in basepath:
                groundtruth_file = os.path.join(diplay_path, 'groundtruth.txt')
                f = open(groundtruth_file, "r")
                with f:
                    groundtruth = [list(map(float,i.strip().split(","))) for i in f]
            elif 'ManakinDATA2018' in basepath: 
                groundtruth_file = os.path.join(diplay_path, 'groundtruth_new.txt')
                f = open(groundtruth_file, "r") 
                with f:
                    groundtruth = [list(map(float,i.strip().split(" "))) for i in f]
            else:
                print('ERROR: no such dataset')


            i = -1
            gt = -1
            for i, gt in enumerate(groundtruth):
                if sum(gt) > 0:
                    break
            
            f.close()
            if i >= 0:
                # get first non-zero entry of ground truth
                bbox = tuple(groundtruth[i])

                # Uncomment the line below to select a different bounding box
                # bbox = cv2.selectROI(frame, False)

                if not os.path.exists(os.path.join(diplay_path,'output')):
                    os.mkdir(os.path.join(diplay_path,'output'))

                output_file = open(os.path.join(diplay_path,'output','output_'+tracker_type+'.txt'),'w') 
                output_file.write('%d %d %d %d\n' % bbox)

                # Read first frame
                frame = cv2.imread(os.path.join(
                    diplay_path, "%08d" % (i+1)+'.jpg')) # +1 because image names start at 00000001.jpg

                ok = tracker.init(frame, bbox)

                count = i+1 
                failureDetected = False
                while count < num_imgs and failureDetected == False: 
                    # Read a new frame
                    frame = cv2.imread(os.path.join(
                        diplay_path, "%08d" % (count+1)+'.jpg')) # +1 because image names start at 00000001.jpg

                    # Start timer
                    timer = cv2.getTickCount()

                    # Update tracker
                    ok, bbox = tracker.update(frame) 

                    # Calculate Frames per second (FPS)
                    #fps = cv2.getTickFrequency() / (cv2.getTickCount() - timer)

                    # tracking failure if overlap of valid gt (>0) and groundtruth is 0 
                    # -> we track until tracking failure occurs (typically as soon as bird starts moving)
                    #overlap = helpers.bb_intersection_over_union(groundtruth[count], bbox)
                    #if (sum(groundtruth[count])>0 and overlap == 0):
                    #    ok = False 

                    # Draw bounding box
                    if ok:
                        # Tracking success
                        p1 = (int(bbox[0]), int(bbox[1]))
                        p2 = (int(bbox[0] + bbox[2]), int(bbox[1] + bbox[3]))
                        cv2.rectangle(frame, p1, p2, (255, 0, 0), 2, 1)

                        output_file.write('%d %d %d %d\n' % bbox)
                    else:
                        # Tracking failure
                        #cv2.putText(frame, "Tracking failure detected", (100, 80),
                        #            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 255), 2)
                        #output_file.write('%d %d %d %d\n' % tuple([-1,-1,-1,-1]))
                        output_file.write('%d %d %d %d\n' % bbox)
                        #print('failure at')
                        #print(count)
                        failureDetected = True

                    count += 1
                output_file.close()

    listfile.close()


