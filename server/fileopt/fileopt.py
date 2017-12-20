import pandas as pd 

def readFileToDataFrame(datadir):
	print("readFileToDataFrame")
	return readCSVFileToDataFrame(datadir);

def readCSVFileToDataFrame(datadir):
	#preprocessing to sort the data into dataframe
	print('[4.1]')
	df = pd.read_csv(datadir)
	print('[4.2]')
	return df;