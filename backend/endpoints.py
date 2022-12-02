import logging

from flask_pymongo import pymongo
from flask import jsonify, request ,redirect, url_for
import pandas as pd
import gridfs
from io import StringIO
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import json
import findspark
findspark.init()
import pyspark
import pyspark.pandas as ps
from pyspark.sql import SparkSession
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.metrics import confusion_matrix, accuracy_score , mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
from pycaret.classification import *
from prophet import Prophet
import datetime
import base64
from io import BytesIO
from matplotlib.figure import Figure
import seaborn as sns
from bson.objectid import ObjectId
import csv 


con_string = "mongodb+srv://afsal:afsal123@cluster0.u9chjpt.mongodb.net/?retryWrites=true&w=majority"

client = pymongo.MongoClient(con_string)

db = client.get_database('dummy')

user_collection = pymongo.collection.Collection(db, 'Test')

dt_collection = pymongo.collection.Collection(db, 'Datasets')

data_collection = pymongo.collection.Collection(db, 'data_history')

mp_collection = pymongo.collection.Collection(db, 'predicted_details')

algo_collection = pymongo.collection.Collection(db, 'algo_history')

sales_collection = pymongo.collection.Collection(db, 'sales_history')

print("MongoDB connected Successfully")




def project_api_routes(endpoints):
    @endpoints.route('/hello', methods=['GET'])
    def hello():
        res = 'Hello world'
        print("Hello world")
        return res

    @endpoints.route('/register-user', methods=['POST'])
    def register_user():
        resp = {}
        try:
            req_body = request.json
            # resp['hello'] = hello_world
            # req_body = req_body.to_dict()
            user_collection.insert_one(req_body)            
            print("User Data Stored Successfully in the Database.")
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Stored Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


   

    @endpoints.route('/read-users',methods=['GET'])
    def read_users():
        resp = {}
        try:
            users = user_collection.find({})
            print(users)
            users = list(users)
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Retrieved Successfully from the Database."
            }
            output = [{'Email' : user['email'] , 'Password' : user['password']} for user in users]   #list comprehension
            resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp

     

    @endpoints.route('/update-users',methods=['PUT'])
    def update_users():
        resp = {}
        try:
            req_body = request.json
            # req_body = req_body.to_dict()
            user_collection.update_one({"id":req_body['id']}, {"$set": req_body['updated_user_body']})
            print("User Data Updated Successfully in the Database.")
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Updated Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp    

    @endpoints.route('/profile',methods=['POST'])
    def profile():
        resp = {}
        try:
            req_body = request.json
            print(req_body)
            users = user_collection.find({"name":req_body['name']})
            print(users)
            users = list(users)
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Retrieved Successfully from the Database."
            }
            output = [{'Name' : user['name'] ,'Email' : user['email'] , 'Password' : user['password']} for user in users]   #list comprehension
            resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp

    @endpoints.route('/handle-signin',methods=['POST'])
    def handle_signin():
        resp = {}
        try:
            req_body = request.json
            print(req_body)
            email = req_body['email']
            print(email)
            user_exist = user_collection.find_one({'email': email})
            print(user_exist)
            db_pass=user_exist['password']
            if req_body['password']==db_pass :
                print("User Data found in the Database.")
                access_token = create_access_token(identity=email)
                name=user_exist['name']
                status = {
                    "statusCode":"200",
                    "statusMessage":"User Data is found in the Database.",
                    "access_token":access_token,
                    "name":name
                } 
            else:
                print("User Data is not found in the Database.")
                status = {
                    "statusCode":"400",
                    "statusMessage":"User Data is not found in the Database."
                }     
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


    @endpoints.route('/delete',methods=['DELETE'])
    def delete():
        resp = {}
        try:
            delete_id = request.args.get('delete_id')
            user_collection.delete_one({"id":delete_id})
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Deleted Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp
    
    @endpoints.route('/predict',methods=['POST'])
    def predict_model():
        resp = {}
        try:
            req_body = request.json
            print(req_body)
            product_type=float(req_body['type'])
            quantity=float(req_body['quantity'])
            gross_sales=float(req_body['gsales'])
            discount=float(req_body['discount'])
            rtrn=float(req_body['rtrn'])
            fs= gridfs.GridFS(db)
            a=ObjectId('637718f9087285221c8e626b')
            bytesdata=fs.get(a).read()
            s=str(bytesdata,'utf-8')
            data = StringIO(s) 
            data_set=pd.read_csv(data)
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
            if(req_body['button']==1):
                regressor= KNeighborsRegressor(n_neighbors=4)
                regressor.fit(x_train, y_train)
                # print(st_x.transform([[product_type,quantity,gross_sales,discount,rtrn]]))
                ans=regressor.predict(st_x.transform([[product_type,quantity,gross_sales,discount,rtrn]]))
                #y_pred= regressor.predict(x_test)
                strans=str(ans[0])
                print('knn '+strans)
            elif(req_body['button']==2):
                regressor= RandomForestRegressor(max_depth=2, random_state=0)
                regressor.fit(x_train, y_train)
                # print(st_x.transform([[product_type,quantity,gross_sales,discount,rtrn]]))
                ans=regressor.predict(st_x.transform([[product_type,quantity,gross_sales,discount,rtrn]]))
                #y_pred= regressor.predict(x_test)
                strans=str(ans[0])
                print('RF '+strans)
            status = {
                "statusCode":"200",
                "statusMessage":"Output is predicted for given Data.",
                "value":strans
            }
            #output = [{'Email' : user['email'] , 'Password' : user['password']} for user in users]   #list comprehension
            #resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


  

    @endpoints.route('/algo_analyze', methods=['POST'])
    def algo_analyze():
        resp = {}
        try:
            print(request.files['file'])
            file = request.files.get('file')
            f_name=secure_filename(file.filename)
            bytesdata=request.files['file'].stream.read()
            s=str(bytesdata,'utf-8')
            strdata = StringIO(s) 
            df=pd.read_csv(strdata)
            data = df.sample(frac=0.85, random_state=786)
            data_unseen = df.drop(data.index)
            data.reset_index(inplace=True, drop=True)
            data_unseen.reset_index(inplace=True, drop=True)
            print('Data for Modeling: ' + str(data.shape))
            print('Unseen Data For Predictions: ' + str(data_unseen.shape))
            exp_clf101 = setup(data = data, target = 'Purchased', session_id=123 , silent=True) 
            best_model = compare_models()
            bm=pull()
            print(bm)
            tabvalue=bm.values.tolist()
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Stored Successfully in the Database.",
                "jsonvalue":tabvalue,
                "fname":f_name
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp

    
    
    def mapDataTypeName(dataType):
        if dataType.find("float") == 0:
            return "Float"
        elif dataType.find("int") == 0:
            return "Integer"
        elif dataType.find("O"):
            return "String"

    

    @endpoints.route('/sales',methods=['POST'])
    def sales():
        resp = {}
        try:
            req_body = request.json
            type= req_body['type']
            value = int(req_body['value'])
            path = 'https://raw.githubusercontent.com/jbrownlee/Datasets/master/monthly-car-sales.csv'
            df = pd.read_csv(path, header=0)
            df.columns = ['ds', 'y']
            df['ds']= pd.to_datetime(df['ds'])
            train = df.drop(df.index[-12:])
            #print(train.tail())
            model = Prophet()
            model.fit(train)
            pred=model.predict(model.make_future_dataframe(value, freq = type, include_history=False))
            pred_value = pred[['ds','yhat']].values.tolist()
            fields = ['Dates', 'Predicted_sales'] 
            filename = "predicted_records.csv"
            with open(filename, 'w', newline='') as csvfile: 
                csvwriter = csv.writer(csvfile) 
                csvwriter.writerow(fields) 
                csvwriter.writerows(pred_value)
            fig = Figure()
            ax = fig.subplots()
            sns.lineplot(data=pred,x='ds',y='yhat',ax=ax)
            buf = BytesIO()
            fig.savefig(buf, format="png")
            data = base64.b64encode(buf.getbuffer()).decode("ascii")
            fig = Figure()
            ax = fig.subplots()
            sns.distplot(pred['yhat'],ax=ax)
            buf = BytesIO()
            fig.savefig(buf, format="png")
            data1 = base64.b64encode(buf.getbuffer()).decode("ascii")
            fig = Figure()
            ax = fig.subplots()
            sns.ecdfplot(data=pred, y="yhat",ax=ax)
            buf = BytesIO()
            fig.savefig(buf, format="png")
            data2 = base64.b64encode(buf.getbuffer()).decode("ascii")
            print(pred_value)
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Deleted Successfully in the Database.",
                "pred": pred_value,
                "data":data,
                "data1":data1,
                "data2":data2
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


    @endpoints.route('/save-sales', methods=['POST'])
    def save_sales():
        resp = {}
        try:
            req_body = request.json
            x=datetime.datetime.now()
            time=x.strftime("%d %B %Y %X")
            req_body["time"]=time
            print(time)
            print(req_body)
            sales_collection.insert_one(req_body)            
            print("Predicted Data Stored Successfully in the Database.")
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Stored Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


    
    @endpoints.route('/save-algo', methods=['POST'])
    def save_algo():
        resp = {}
        try:
            req_body = request.json
            x=datetime.datetime.now()
            time=x.strftime("%d %B %Y %X")
            req_body["time"]=time
            print(req_body)
            algo_collection.insert_one(req_body)            
            print("Predicted Data Stored Successfully in the Database.")
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Stored Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


    @endpoints.route('/save-model', methods=['POST'])
    def save_model():
        resp = {}
        try:
            req_body = request.json
            x=datetime.datetime.now()
            time=x.strftime("%d %B %Y %X")
            req_body["time"]=time
            print(req_body)
            mp_collection.insert_one(req_body)            
            print("Predicted Data Stored Successfully in the Database.")
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Stored Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp

    
    @endpoints.route('/save-data', methods=['POST'])
    def save_data():
        resp = {}
        try:
            req_body = request.json
            x=datetime.datetime.now()
            time=x.strftime("%d %B %Y %X")
            req_body["time"]=time
            print(req_body)
            data_collection.insert_one(req_body)            
            print("Predicted Data Stored Successfully in the Database.")
            status = {
                "statusCode":"200",
                "statusMessage":"User Data Stored Successfully in the Database."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


    
    @endpoints.route('/dq-history',methods=['GET'])
    def dq_history():
        resp = {}
        try:
            users = data_collection.find({})
            print(users)
            users = list(users)
            status = {
                "statusCode":"200",
                "statusMessage":"Dataset History Retrieved Successfully from the Database."
            }
            output = [{'Dataset' : user['fname'] ,
            'user' : user['user'] ,
            'rc' : user['rc'] ,
            'column' : user['column'] ,
            'types' : user['types'] ,
            'desc' : user['desc'] ,
            'head' : user['head'] ,
            'dcol' : user['dcol'] ,
            'nulls' : user['nulls'] ,
            'tail' : user['tail'] , 
            'Date' : user['time']} for user in users]   #list comprehension
            resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp   


    
    @endpoints.route('/mb-history',methods=['GET'])
    def mb_history():
        resp = {}
        try:
            users = mp_collection.find({})
            print(users)
            users = list(users)
            status = {
                "statusCode":"200",
                "statusMessage":"Dataset History Retrieved Successfully from the Database."
            }
            output = [{'type' : user['product_type'] ,
             'quantity' : user['quantity'] ,
              'gsales' : user['gross_sales'] ,
               'discount' : user['discount'] ,
                'rtrn' : user['return'] ,
                 'algo' :user['algorithm'],
                  'tns' : user['total_net_sales'],
                   'user' : user['user'] ,
                     'time' : user['time'] } for user in users]  
            resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp  

    
    @endpoints.route('/sf-history',methods=['GET'])
    def sf_history():
        resp = {}
        try:
            users = sales_collection.find({})
            print(users)
            users = list(users)
            status = {
                "statusCode":"200",
                "statusMessage":"Dataset History Retrieved Successfully from the Database."
            }
            output = [{'type' : user['type'] ,
             'value' : user['value'] ,
              'user' : user['user'] ,
               'pred' : user['pred'] ,
                'graph1' : user['graph1'] ,
                 'graph2' :user['graph2'],
                  'graph3' : user['graph3'],
                     'time' : user['time'] } for user in users]  
            resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp  


    @endpoints.route('/aa-history',methods=['GET'])
    def aa_history():
        resp = {}
        try:
            users = algo_collection.find({})
            print(users)
            users = list(users)
            status = {
                "statusCode":"200",
                "statusMessage":"Dataset History Retrieved Successfully from the Database."
            }
            output = [{'fname' : user['fname'] ,
              'user' : user['user'] ,
                'value' : user['value'] ,
                 'time' : user['time'] } for user in users]  
            resp['data'] = output
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp  


    
    @endpoints.route('/file_upload',methods=['POST'])
    def file_upload():
        resp = {}
        try:
            spark = SparkSession.builder.getOrCreate()
            spark.conf.set('spark.sql.repl.eagerEval.enabled', True)
            file = request.files.get('file')
            f_name=secure_filename(file.filename)
            print(request.files['file'])
            print(f_name)
            bytesdata=request.files['file'].stream.read()
            s=str(bytesdata,'utf-8')
            strdata = StringIO(s) 
            # fs= gridfs.GridFS(db)
            # a=fs.put(file,filename=f_name)
            # bytesdata=fs.get(a).read()
            # s=str(bytesdata,'utf-8')
            # data = StringIO(s) 
            pandas_df=pd.read_csv(strdata)
            df=ps.from_pandas(pandas_df)
            col1= df.columns.to_list()
            rc=list(df.shape)
            types=df.dtypes.to_list()
            colTypes=[]
            fcol = [["count"],["mean"],["std"],["min"],["25%"],["50%"],["75%"],["max"]]
            for i , j in zip(col1,types):
                colTypes.append({"name":i,"value":mapDataTypeName(str(j))})
            print(colTypes)
            desc=df.describe().values.tolist()
            a=0
            for i in desc:
                for j in i:
                    fcol[a].append(j)
                a+=1
            print(fcol)
            desccol=['']
            dcol=df.describe().columns.to_list()
            for i in dcol:
                desccol.append(i)
            nullsum=[]
            nulls=df.isnull().sum().to_list()
            for i , j in zip(col1,nulls):
                nullsum.append({"name":i,"value":j})
            print(nullsum)
            head=df.head().to_numpy().tolist()
            tail=df.tail().to_numpy().tolist()
            out = {
                "col":col1,
                "rc":rc,
                "types":colTypes,
                "nullsum":nullsum,
                "desc":fcol,
                "desccol":desccol,
                "head": head,
                "tail":tail,
                "fname":f_name
            }
            status = {
                "statusCode":"200",
                "statusMessage":"File uploaded Successfully.",
                "col":col1
            }
            resp["out"]=out
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp


    return endpoints
