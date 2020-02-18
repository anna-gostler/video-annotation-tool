def bb_intersection_over_union(boxA, boxB):
	# determine the (x, y)-coordinates of the intersection rectangle
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[0] + boxA[2], boxB[0] + boxB[2])
    yB = min(boxA[1] + boxA[3], boxB[1] + boxB[3])
 
	# compute the area of intersection rectangle
    interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
 
	# compute the area of both the prediction and ground-truth
	# rectangles
    boxAArea = (boxA[2]+1) * (boxA[3]+1)
    boxBArea = (boxB[2]+1) * (boxB[3]+1)
 
	# compute the intersection over union by taking the intersection
	# area and dividing it by the sum of prediction + ground-truth
	# areas - the interesection area
    iou = interArea / float(boxAArea + boxBArea - interArea)
 
	# return the intersection over union value
    return iou

import os
def count_files(path,extension):
    list_dir = []
    list_dir = os.listdir(path)
    count = 0
    for file in list_dir:
        if file.endswith(extension): # eg: '.txt'
            count += 1
    return count

def tracked_frames_until_first_failure(output, groundtruth, num_imgs):
    # given: 
    # output: first output = frame after first valid output

    # output: 
    # count tracked frames, do not include failure frame
    # start counting from first valid gt 
    first_gt = 0
    for i, gt in enumerate(groundtruth):
        if sum(gt) > 0 :
            first_gt = i
            break

    out_idx = 0
    #for i in range(first_gt+1, get_last_valid_frame(groundtruth, num_imgs)):
    for i in range(first_gt+1, min(len(output), get_last_valid_frame(groundtruth, num_imgs))):
        gt = groundtruth[i]
        out = output[out_idx]
        #print('last valid')
        #print(get_last_valid_frame(groundtruth, num_imgs))
        #print(out_idx)
        #print(len(output))
        #if gt exists and overlap == 0 => fail
        if sum(gt) > 0 and bb_intersection_over_union(out, gt) == 0:
            failure_frame = i
            return failure_frame - first_gt

        #for trackers that stop tracking when they fail (MT4)??
        if len(output) == out_idx+1:
            failure_frame = i #len(output) # i? i+1?
            return failure_frame - first_gt 
        out_idx += 1

    #for i, out in enumerate(output):
    #    gt = groundtruth[i]
    #    #if gt exists and overlap == 0 => fail
    #    if sum(gt) > 0 and bb_intersection_over_union(out, gt) == 0:
    #        failure_frame = i
    #        return failure_frame - first_gt
    
    #if no failure
    #return min(len(groundtruth),num_imgs) - first_gt
    return min(len(output), min(len(groundtruth), num_imgs) - first_gt)  

def accuracy(output, groundtruth, tracked_frames_from_move, first_moving_frame, display_idx, tracker_type):
    acc = 0
    n = 0
    #if tracked_frames_from_move > 0:
        #print('start')
        #print(tracked_frames_from_move)
        #print(groundtruth[first_moving_frame])
        #print(groundtruth[first_moving_frame-1])
    first_gt = get_first_valid_gt_idx(groundtruth)

    for i in range(first_moving_frame-1, first_moving_frame+tracked_frames_from_move):
        if i-first_gt-1 < len(output): #for MT4 trackers because output is shifted by one -> OK
            #print('---')
            #print(i-first_gt-1)
            #print(len(output))
            #print(first_moving_frame+tracked_frames_from_move-2)
            #print(tracked_frames_from_move)
            #print(display_idx)

            gt = groundtruth[i]
            out = output[i-first_gt-1]
            #if tracker_type == 'MOSSE':
            #    print(gt)
            #    print(out)
            #    print(tracked_frames_from_move)
            #    print(bb_intersection_over_union(out, gt))

            if sum(gt) > 0 and bb_intersection_over_union(out, gt) > 0:
                acc += bb_intersection_over_union(out, gt)
                n += 1
                #print('gt > 0')
                #print(out)
                #print(gt)
                #print(str(bb_intersection_over_union(out, gt)))

        #if i-first_gt-1 >= len(output):
        #    print(tracker_type)
        
    if n > 0:
        return (acc/n)
    else:
        return 0



def get_output_MT2(output, groundtruth, num_imgs):
    # input: 1st line gt 2nd = output 3rd = overlap 4th=is sitting/or reset? 
    # gets restarted at failure
    # output: output bboxes from ManakinTracker2 starting at frame after first valid gt
    #first_gt = 0
    #for i, gt in enumerate(groundtruth):
    #    if sum(gt) > 0 :
    #        first_gt = i
    #        break

    first_gt = get_first_valid_gt_idx(groundtruth)

    output_only = []
    skip = 7 # 4 for other manakin2 output; 7 for __param
    counter = ((first_gt+1)*skip)
    for i in range(first_gt+1, min(len(groundtruth), num_imgs)): #first_gt+1 -> i not used as index
        
        #print(groundtruth[i])
        #print(output[counter+1])
        #print(output[counter])
        #print(output[counter+1]) # output
        #print(output[counter+2]) # overlap
        #print(output[counter+3]) # sitting (i think)

        #if (groundtruth[i]) == output[counter+1]:
        #    print('--------------------')
        #    print((output[counter]))
        #    print((output[counter+1]))
        #    print (output[counter+2])
        #    print (output[counter+3])
        #    print (output[counter+4])
        #    print (output[counter+5])
        #    print (output[counter+6])
        #    print('--------------------')


        output_only.append(output[counter+1])
        counter += skip
    #print(output_only)
    return output_only

def display_idx_to_diplay(display_idx, basepath):
    listfile = open(os.path.join(basepath, 'list.txt'), "r")
    return listfile.readlines()[display_idx].rstrip()

def diplay_to_display_idx(display, basepath):
    listfile = open(os.path.join(basepath, 'list.txt'), "r")
    for idx, name in enumerate(listfile): 
        if name.rstrip() == display.rstrip():
            return idx
    return None

def get_first_valid_gt_idx(groundtruth):
    idx = -1
    for i,gt in enumerate(groundtruth):
        if sum(gt)>0:
            idx = i 
            break
    return idx

def get_first_failure_idx(output, groundtruth):
    # input: output starts at first valid gt + 1
    # output: first failure (counting from ---> first gt)
    # no failure: idx = -1

    first_gt = get_first_valid_gt_idx(groundtruth)

    idx = -1
    for i,out in enumerate(output):
        # print('----')
        # print(len(output))
        # print(len(groundtruth))
        # print(first_gt)
        # print(i)
        # print(first_gt + 1 + i)
        if first_gt + 1 + i < len(groundtruth):
            gt = groundtruth[first_gt + 1 + i]
            if sum(gt)>0 and bb_intersection_over_union(gt,out) == 0:
                idx = i 

                #print('fail at')
                #print(i)
                #print(gt)
                #print(out)
                break
    if idx == -1:
        return -1
    else:
        return idx+first_gt+1    


def get_sequences_with_50_plus_frames_after_move_no_gt_errors():
    return (4,5,9,10,11,15,16,17,18,19,20,21,22,23,24,25,26,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,69,70,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,94,95,96,97,102,103,104,106)

# idx starts at 0
def formatImgIdx(i):
    return "%08d" % (i+1)+'.jpg'

# index starts at 0 
def get_last_valid_frame(groundtruth, num_imgs):
    last_valid_gt_frame = -1

    for i, gt in enumerate(groundtruth):
        if sum(gt) > 0 and i <= num_imgs-1: 
            last_valid_gt_frame = i   # find the last frame with valid gt
        if i == num_imgs-1:
            break    
    return last_valid_gt_frame


def get_tracker_names(trackers):
    tracker_names = [None]*len(trackers)

    for tr, tracker_name in enumerate(trackers):
        tracker_names[tr] = tracker_name
        if tracker_name == 'output_ManakinTracker4_update_0':
            tracker_names[tr] = 'ManakinTracker (no update)'
        elif 'ManakinTracker' in tracker_name:
            tracker_names[tr] = 'ManakinTracker'

        if tracker_name == 'siam':
            tracker_names[tr] = 'DA Siam LT'
        if tracker_name == 'eco':
            tracker_names[tr] = 'ECO'
    return tracker_names
