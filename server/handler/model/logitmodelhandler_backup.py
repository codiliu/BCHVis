import tornado.web
import pandas as pd
import numpy as np 
import pylab as pl
import json
import statsmodels.api as sm

class LogitModelHandler(tornado.web.RequestHandler):
   
    def post(self):

        def convertData(df):

            print('convert data');
            col_list = df.columns;
            colset_map = {};
            keep_col_list = ['delayDuration', 'trajID']
            skip_col_list = [];
            for col in col_list:
                if((col not in keep_col_list)):
                    colset = list(set(df[col]));
                    if(len(colset) == 1):
                        skip_col_list.append(col);
                        continue;
                    else:
                        colset_map[col] = colset;
            print(colset_map);

            newrows = []
            for index, row in df.iterrows():
                newrow = {};
                for col in col_list:
                    if(col == 'delayDuration'):                        
                        if(float(row[col])/60000 > 30):
                            newrow['delay'] = 1
                        else:
                            newrow['delay'] = 0
                    elif(col == 'trajID'):
                        continue;
                    else:         
                        if(col in skip_col_list):
                            continue;
                        else:               
                            newrow[col] = colset_map[col].index(row[col]);                        
                newrows.append(newrow);

            df_new = pd.DataFrame(data = newrows);
            print(df_new.head());
            return {
            'dict': colset_map, 
            'df': df_new}


        print('logit model handler');
        self.set_header('Access-Control-Allow-Origin', "*")

        constraint = self.get_argument('constraint')
        constraint = json.loads(constraint)

        df_new = pd.DataFrame(data = constraint['data']);

        # print('recieved ', constraint['data']);
        print('convert data ', len(df_new), df_new.head());
        
        convertResult = convertData(df_new);        
        df = convertResult['df'];
        colDict = convertResult['dict'];

        #pd.read_csv('/Users/MissDeer/Workspace/Exe.Web_Programming/pylogit-master/examples/.ipynb_checkpoints/test.csv')
        df.to_csv('test.csv', index = False);
        # print(df.head(), len(df))
        dummyColumnList = list(df.columns);# ['airline', 'city', 'hours', 'month', 'weekday']#['airline', 'airport', 'deptime', 'dayinyear', 'dayinweek', 'timeinday']
        dummyColumnList.remove('delay');
        depVarible = 'delay'
        #create dummay variables
        cols_to_keep = []
        cols_to_train = []
        dummyDataFrame = pd.DataFrame();

        for variable in df.columns:
            if(variable in dummyColumnList):
                print('dummy variable', variable);
                dummyVaribleList = pd.get_dummies(df[variable], prefix=variable)
                cols_to_train += list(dummyVaribleList.columns[1:]);
                if(dummyDataFrame.empty == True):
                    dummyDataFrame = dummyVaribleList.ix[:, dummyVaribleList.columns[1]:]
                else:
                    dummyDataFrame = dummyDataFrame[dummyDataFrame.columns].join(dummyVaribleList.ix[:, dummyVaribleList.columns[1]:])
            else:
                if(variable != depVarible):
                    cols_to_train.append(variable);
                cols_to_keep.append(variable);

        data = df[cols_to_keep].join(dummyDataFrame);
        data.to_csv('test_data.csv', index = False);
        print('input data ', len(data), data.head());
        data['intercept'] = 1.0
        print(' train cols ', cols_to_train);
        #model
        try:
            logit = sm.Logit(data[depVarible], data[cols_to_train]);
            result = logit.fit();
            # print(result.summary());

            #process the Logit Result
            #get the p-value < 0.05
            sigPValue = 0.05
            significantCols = []
            impsignificantCols = []
            params = result.params
            conf_int = result.conf_int()
            impactresult = [];

            for key in result.pvalues.keys():
                col = key
                if(result.pvalues[key] < 0.05):
                    siglevel = "sig"
                    pvalue = result.pvalues[key]

                    realCol = col.split('_')[0];
                    indexCol = int(col.split('_')[1]);
                    colName = str(colDict[realCol][indexCol]);

                    if(result.pvalues[key] < 0.01):
                        siglevel = 'supsig'

                    if(params.loc[col] > 0):
                        # print(col, 'positively impact');
                        impactresult.append({
                            'colName': realCol, 
                            'colValue': colName,
                            # 'colname': col,
                            'PN': 'increase delay',
                            'Coef': params.loc[col],
                            'SigLevel': 'sig',
                            'PValue': result.pvalues[col]
                        })
                        # impactresult.append(['positive', 'Significant', params.loc[col],]);
                    else:
                        impactresult.append({
                            'colName': realCol, 
                            'colValue': colName,
                            # 'colname': col,
                            'PN': 'decrease delay',
                            'Coef': params.loc[col],
                            'SigLevel': 'sig',
                            'PValue': result.pvalues[col]
                    })


            print(impactresult)
            impactresult_new = json.dumps(impactresult)

            self.write({
                'model': 'success',
                "data": impactresult_new
                });

        except:
            impactresult_new = json.dumps({'error': 'too few samples'});
            self.write({
                'model': 'fail',
                "data": impactresult_new
                });

     #    self.write({
     #        'data': 'ok'
        # })