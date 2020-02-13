# vue-byte-converter
Vue Components for use [**Byte Converter**](https://github.com/bomdia/byte-converter) libary easily within vue

import the component and use Vue.use() for register the components
there are a named view for all components in kebapcase es = VDataFormatConverter
there is another one named view: **ByteConverter** that expose the original library class packaged in the dist file in case you need

the component register an instance property: $byteConverter for use byte-converter Library in any other part of the application

## **COMPONENTS**

|name|description|property|slot|
|--|--|--|--|
|**v-data-format-converter**|convert value across dataFormats use the default scope for override the default functionality||default scope={...$props,converted,convertedText,toAsName}|
||value in the dataFormat specified by **from**|**value**:Number **required**||
||show the **to** dataFormat name|**viewName**:Boolean=false||
||show the **to** dataFormat|**viewDataFormat**:Boolean=false||
||show value as speed B/s|**speed**:Boolean=false||
||the current value dataFormat|**from**:String='B'||
||the wanted value dataFormat|**to**:String='MiB'||
||if you want to localize value|**localize**:Boolean=false||
||the locale to use if localize is true|**locale**:String='en'||
||the minimum number of digit after decimal point|**minimumFractionDigits**:Number=-1||
||the maximum number of digit after decimal point|**maximumFractionDigits**:Number=-1||
|||||
|**v-data-format-auto-converter**|convert value across dataFormats automatically use the default scope for override the default functionality||default scope={...$props,converted,convertedText,to,toAsName}|
||value in the dataFormat specified by **from**|**value**:Number **required**||
||show the **to** dataFormat name|**viewName**:Boolean=false||
||show the **to** dataFormat|**viewDataFormat**:Boolean=false||
||show value as speed B/s|**speed**:Boolean=false||
||the current value dataFormat|**from**:String='B'||
||if you want to localize value|**localize**:Boolean=false||
||the locale to use if localize is true|**locale**:String='en'||
||the minimum number of digit after decimal point|**minimumFractionDigits**:Number=-1||
||the maximum number of digit after decimal point|**maximumFractionDigits**:Number=-1||
||the option for scale algorithm|**scaleOptions**:Object = {||
||have to prefer Byte unit|   preferByte:Boolean=false,||
||or have to prefer Bit unit|   preferBit:Boolean=false,||
||or have to prefer same unit|    preferSameUnit:Boolean=true,||
||or have to prefer opposite unit|    preferOppositeUnit:Boolean=false,||
||have to prefer Binary base|   preferBinary:Boolean=false,||
||or to prefer Decimal base|    preferDecimal:Boolean=false,||
||or to prefer same base|   preferSameBase:Boolean=true,||
||or to prefer opposite base|   preferOppositeBase:Boolean=false,||
||an handler function for custom filtering dataFormats return true to pass or false to filter|   handler:Function->Boolean }||
|||||
