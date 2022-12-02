
import pandas as pd

import pyspark
from pyspark.sql import SparkSession
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.metrics import confusion_matrix, accuracy_score

data_set= pd.read_csv("business.retailsales.csv")
data_set.dropna(inplace=True)
le=LabelEncoder()
le.fit(data_set["Product Type"])
data_set["Product Type"]=le.transform(data_set["Product Type"])
x= data_set.iloc[:, [0,1,2,3,4]].values
y= data_set.iloc[:, 5].values
x_train, x_test, y_train, y_test= train_test_split(x, y, test_size= 0.25, random_state=0)
st_x= StandardScaler()
x_train= st_x.fit_transform(x_train)
x_test= st_x.transform(x_test)
regressor= KNeighborsRegressor(n_neighbors=4)
regressor.fit(x_train, y_train)
y_pred= regressor.predict(x_test)
print(regressor.predict(st_x.transform([[1,	34	,14935	,-594	,-1609]])))