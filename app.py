import flask
from flask import Flask, render_template, request, url_for, redirect
import os
import glob
import json
import base64
import ipdb 
import numpy as np
from PIL import Image
import PIL
import re
from io import BytesIO
import LPCA_SRC_Classify as classifier

app = Flask(__name__ )
app.debug = True

imageDict = {}

facialPath = r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\FacialImages\\'
for classes in os.listdir(facialPath)[0:5]:
	print(classes)
	files = [x for x in os.listdir( facialPath + classes ) if x[-3:] == 'pgm' ][0:10] 
	
	temp = []
	for x in files:
		#load up image
		iMatrix =  np.array(Image.open(facialPath + classes + '\\' + x)).flatten().tolist()
		#convert to rgba matrix, probably not necessary?
		iMatrix = [ v for v in iMatrix for _ in (0,1,2,3)  ] 
		#set alpha
		iMatrix[3::4] = int(len(iMatrix)/4)*[255]
		w = [ x, json.dumps(iMatrix) ]
		
		temp.append(w)
		
	# pics = [ [x, json.dumps( [ v for v in np.array(Image.open(facialPath + filename + '\\' + x)).flatten().tolist() for _ in (0,1,2,3)  ]  )  ] for x in files ]

	
	imageDict[classes]  = temp

@app.route("/", methods = ["GET","POST"])
def index():
								   
	return render_template('index.html' , images = imageDict)





@app.route("/imageAnalysis", methods = ["POST"])
def imageAnalysis():

	img_dict = re.match("data:(?P<type>.*?);(?P<encoding>.*?),(?P<data>.*)", request.form['image']).groupdict()
	blob = img_dict['data'] 

	im = Image.open(BytesIO(base64.b64decode(blob))).convert('L').resize(  (168,192  ) , PIL.Image.ANTIALIAS) 
	matrix = np.array(im)
	print( matrix.shape )
	label = classifier.LPCA_SRC_Classify(matrix)

	return '0' 
	


if __name__ == "__main__":
    app.run(port=5015)