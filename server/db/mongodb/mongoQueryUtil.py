class MongoQueryUitl():
    @staticmethod
    def pointCondition2mongo(condition):
        res = {}
        if(condition == None):
            return res

        if(condition['type'] == 'logical'):
            key = '$' + condition['lType']
            val = []
            for cnd in condition['condition']:
                val.append(MongoQueryUitl.pointCondition2mongo(cnd))
            res[key] = val
            return res

        elif(condition['type'] == 'single'):
            if(condition['sType'] == 'centerSphere'):
                res['loc'] = {}
                res['loc']['$geoWithin'] = {}
                res['loc']['$geoWithin']['$centerSphere'] = condition['condition']
            else:
                print("single Type err!")

            return res

        else:
            print("condition type err!")

    @staticmethod
    def lineCondition2mongo(condition):


        res = {}
        #return res
        if(condition == None):
            return res

        if(condition['type'] == 'logical'):
            key = '$' + condition['lType']
            val = []
            for cnd in condition['condition']:
                val.append(MongoQueryUitl.pointCondition2mongo(cnd))
            res[key] = val
            return res

        elif(condition['type'] == 'single'):
            if(condition['sType'] == 'Polygon'):
                res['loc'] = {}
                res['loc']['$geoIntersects'] = {}
                res['loc']['$geoIntersects']['$geometry'] = condition['condition']
            else:
                print("single Type err!")

            return res

        else:
            print("condition type err!")

