# vue-byte-converter
Vue Components for use [**Byte Converter**](https://github.com/bomdia/byte-converter) libary easily within vue

import the components and use Vue.use() for register the components

## **COMPONENTS**

|name|description|property|slot|
|v-data-format-converter|convert value across dataFormats|**value**:Number **required**,**viewName**:Boolean=false,**viewUnit**:Boolean=false,**speed**:Boolean=false,**from**:String='B',**to**:String='MiB',**localize**:Boolean=false,**locale**:String='en',**minimumFractionDigits**:Number=-1,**maximumFractionDigits**:Number=-1|default|
|v-data-format-auto-converter|convert value across dataFormats automatically|||
|v-data-format-list|list of dataFormats|||
