import numpy as np
import pandas as pd
from algorithms import l1l2_regularization
import os

os.chdir('data')
# Load in trained classification model:
DICT_full = np.array(pd.read_csv(r'DICT_full.dat', header=None))
lab_DICT_full = np.array(pd.read_csv(r'lab_DICT_full.dat', header=None))
PCA_mapping = np.array(pd.read_csv(r'PCA_mapping.dat', header=None))
r_1 = float(np.array(pd.read_csv(r'r_1.dat', header=None)))
train_ind = np.array(pd.read_csv(r'train_ind.dat', header=None))
train_mean = np.array(pd.read_csv(r'train_mean.dat', header=None))
train_pt_ind = np.array(pd.read_csv(r'train_pt_ind.dat', header=None))

# Reformat:
train_mean = np.reshape(train_mean, (32256,))
train_pt_ind = [i-1 for [i] in train_pt_ind]

# Load in test data:
A_test_orig = np.array(pd.read_csv('A_test_orig.dat', header=None))
os.chdir('..')

def LPCA_SRC_Classify(y):
    print('prep')
    # Prep variables:
    DICT_y = np.zeros((np.shape(DICT_full)))
    row_num, col_num = np.shape(DICT_y)
    lab_DICT_y = np.zeros((col_num, 1))  # will contain labels
    X_train_norm = DICT_full[:, train_pt_ind]

    n_train = len(train_pt_ind)
    L = len(np.unique(lab_DICT_full))  # Number of classes
    d_vect = np.ones((L, 1))
	
    print('reshape')
    # Reshape and extract PCA features from test sample:
    if np.shape(y) == (32256,):
        pass
    elif np.shape(y) == (192, 168):
        dim1, dim2 = np.shape(y)
        y = np.reshape(y, (dim1*dim2, 1))
    else:
        ValueError('Image does not have the correct number of pixels.')
    
    print('reshape2')
    print( y.shape )
    print( train_mean.shape )
    print( (y-train_mean).shape)
    y_fea = np.matmul(PCA_mapping.T, y - train_mean)
    y_norm = y_fea/np.linalg.norm(y_fea)
	
    print('distances')
    # Compute distances between the test point and each training point:
    print(np.shape(np.tile(y_norm, (n_train, 1)).T))
    print(np.shape(X_train_norm))
    dist_vects_pos = np.tile(y_norm, (n_train, 1)).T - X_train_norm
    DIST_pos = np.sqrt(sum(dist_vects_pos ** 2))

    dist_vects_neg = np.tile(y_norm, (n_train, 1)).T + X_train_norm
    DIST_neg = np.sqrt(sum(dist_vects_neg ** 2))

    # Compute minimum distance from y to a training sample:
    r_2 = min(min(DIST_pos), min(DIST_neg))

    # Set dictionary pruning parameter:
    r = max(r_1, r_2)

    print('dictionary')
    # Amend dictionary to include only training points (and their corresponding tangent basis vectors) that are within
    # r of the sample:
    ind_pos = np.asarray(np.where(DIST_pos <= r))
    ind_neg = np.asarray(np.where(DIST_neg <= r))
    if ind_pos.size and ind_neg.size:  # if both nonempty
        ind = np.unique(np.concatenate([ind_pos.T, ind_neg.T]))
    elif ind_pos.size and not ind_neg.size:
        ind = ind_pos
    elif ind_neg.size and not ind_pos.size:
        ind = ind_neg

    n_full = len(ind)  # length of DICT_full (ind is the index of nearby training points in A_train)

    count = 0
    ind = list(ind)
    close_train_pts = [train_pt_ind[i] for i in ind]  # index of nearby training points in DICT_full
	
    print('loop')
    for i in range(n_full):  # For each nearby training point
        ctp_i = int(close_train_pts[i])
        class_l_index = int(lab_DICT_full[0, ctp_i])  # class label of this training sample
        d_ind = int(d_vect[class_l_index - 1])  # intrinsic dimension of the class of this training sample
        DICT_y[:, count:count + d_ind + 1] = DICT_full[:, ctp_i - d_ind:ctp_i + 1]
        lab_DICT_y[count:count + d_ind + 1] = class_l_index * np.ones((d_ind + 1, 1))
        count += d_ind + 1

    # Remove empty columns of DICT_y and entries of lab_DICT_y:
    DICT_y = DICT_y[:, 0: count - d_ind]
    lab_DICT_y = lab_DICT_y[0: count - d_ind]
    n_y = len(DICT_y.T)

    # l1-Minimization:#####################################################
    print('minimization')
    x = l1l2_regularization(DICT_y, y_norm, 0, 1e-5)

    # Compute class error for each class:
    ERR_y = np.zeros((L, 1))
    for l in range(L):
        coeff = np.zeros((n_y, 1))
        ind_l = np.where(np.asarray(lab_DICT_y) == l+1)[0]
        if ind_l.size:  # if DICT_j contains vectors from class l
            coeff[ind_l] = x[ind_l]
            y_hat = np.reshape(np.matmul(DICT_y, coeff), (row_num,))
            ERR_y[l] = np.linalg.norm(y_norm - y_hat)
        else:
            ERR_y[l] = np.inf

    return np.argmin(ERR_y) + 1, [i[0] for i in ERR_y]


# TO DO: 3. Formatting outside function where possible, possibly save as additional csv files?
#        4. Any redundant variables?
#        5. Clean up code, make look nice
#        6. Consider how we want to display output (maybe ask Ryan his opinion)

# for i in range(20):
    # cl_info = LPCA_SRC_Classify(A_test_orig[: ,i])
    # print("The predicted class of the test sample is {}.".format(cl_info[0]))
    # print("The residual for each class is as follows:")
    # for l in range(10):
        # print("The class {} residual is {:.2}".format(l+1, cl_info[1][l]))
    # print("\n")

