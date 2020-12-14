# FHIR TESTDATA GENERATOR

## SIMPLE TESTDATA GENERATOR

This is a simple FHIR testdata generator, which takes patient descriptions from ./input and uses the resource blueprints as specified in
the src/config/resource-blueprints.json file to generate testdata.

It does this by changing the blueprint resources as specified in the patient descriptions in the input folder.


## RUN INSIDE DOCKER - FOR DEV

Start the nodejs docker container for development: `docker-compose -f docker-compose.dev.yml`

connect to the development docker container `docker-compose -f docker-compose.dev.yml exec testdatagenerator bash`

Run the tesdata generator inside the container - see USING THE TESTDATA GENERATOR below.


## RUN WITHOUT DOCKER - FOR DEV

Note: this requires one to install nodejs on your machine before the programm can be executed

Run the generator using the following command:

`npm install`
`node src/generator.js`

=> This will download the dependencies and execute the generator.
The generated JSON FHIR resources can then be found in the /output folder in the genData.json file as newline delimited JSON strings

Run the tesdata generator - see USING THE TESTDATA GENERATOR below.


## USING THE TESTDATA GENERATOR

### Generate data

to run the testdata generator execute `node src/generator`. 
This runs the generator. It takes all data generation descriptions from the ./input folder and generates the repsspective FHIR bundles in the ./output folder of this repository.

To configure the generator change the idpath-config.json and resource-blueprint.json in the ./src/config folder.

The generator is a simple program, which takes resource blueprints from the resource-blueprints.json and replaces single elements as defined in the respective generation description.
resource-blueprints.json

By replacing a resource in the resource-blueprints.json you can inject your own resources.


The idpath-config.json tells the generator which IDs to replace with the ones auto-generated by the generator.

idpath-config.json explained:

The idpath-config.json contains an array for each resource type with objects that specify the id replacements:

```
{
      "path": "$.subject.reference",   # json path to the reference to be replaced
      "counterName": "Patient",        # the name of the counter to be used for filling this reference "in this case the Patient counter"
      "refPrefix": "Patient/"          # the prefix to but in front of the generated id - if not set no prefix will be added
}
```

### Creating a Generation Description

To Create a generation description add a <any-name>.json file to the ./input folder.
We have placed some examle testdata generation description in the ./input folder for you.

A generation description has some metadata:
|name| the name of the description - used to name the bundles in the ./ouput folder|
|idOffsets| contains the offsets for each counter - this is used to say from which id the generator starts to count in order to generate the ids - there has to be one for each resource type (e.g. "Patient") used|

It then contains a Bundle object with an array of generation objects, which contain the description of how the resources are to be generated.
The generator expects exactly one patient and one encounter blueprint.
It can contain a multiple of other resources like for example Observation.

for each generation object contains a reference to a blueprint and then a generation description ("genDesc").
The generation description is an object which contains jsonpath expression for elements of the blueprint to be replaced.

For example "$.gender" would replace the gender element of a resource. 
For each of these expression one can either define a replacement directly (For example "$.gender": "myReplacementValue")
or use a replacement function, which generate data based on one of a predefined set of functions.
which function to use is speficied in the "function" element. If a function element is added a "params" element also has to be added.
which params to add depends on the function used.

The following functions are currently available:

|Function|description|params|
|--|--|--|
|genNumber|generatas a random number|"min": decimal minimum number, "max": decimal maximum number, "precision": the ||precision to be used integer (e.g. 4) |
|genEnum|randomly picks a value from a list|"options": a json array as options list to pick from |
|genDate|generatas a random date|"start": the start date format = "1952-01-01T09:45:00+01:00" , "end": the start date format = "1952-01-01T09:45:00+01:00", "format": the format of the date e.g. ""yyyy-mm-dd" if not specified defaults to "yyyy-mm-dd'T'hh:MM:ss+02:00" |
|valueFromEntry|picks the value from an element of the same resource based on its jsonpath |"replaceValue": the jsonpath of the element from the same resource to replace the value with|
|valueFromRessource|picks the value from an element of the another resource generated in this bundle based on its jsonpath within the bundle - note: the ressource the value is picked from needs to be before the generation desc of the current ressource| "resourcePath": the jsonpath of the element from the same resource to replace the value with|
|dateDistanceFromRessource|randomly generates a date within a certain time period before or after a date from another resource of the same bundle - note: the ressource the value is picked from needs to be before the generation desc of the current ressource|"resourcePath": the jsonpath of the element from the same resource to replace the value with, "distancePlus": the distance minus in days from the picked date, "distanceMinus": the distance minus in days from the picked date|

---

```
"genDesc": {
        "$.gender": {
          "function": "genEnum",
          "params": {
            "options": [
              "male"
            ]
          }
        },
        "$.birthDate": {
          "function": "genDate",
          "params": {
            "start": "1952-01-01T09:45:00+01:00",
            "end": "1999-01-01T09:45:00+01:00",
            "format": "yyyy-mm-dd"
          }
        }
      }
    }
```


### Bundle data

The generator generates one bundle per patient per resource description. This leads to very small bundles in the ./output folder.
To remedy this situation this repository provides a bundle bundler, which combines the bundles into larger bundles of size 100.
to create these bundles execute `node src/bunleBundles.js`

### Load data to a FHIR store

The generated bundles are saved in ndjson (new line delimited json) format. You can load these bundles into any FHIR store using any FHIR ndjson capable FHIR loader.
Here we also provide a simple FHIR loader, which sends each bundle to a FHIR store.

To load the data execute `node src/loadFHIRData.js <host> <port> <path> <user> <password>`
User and password are optional params for basic auth. If left blank no authentication will be used.
=> Example: `node src/loadFHIRData.js localhost 8080 FHIR`

Note: If you are inside a docker container and want to send the data to a FHIR server on your local docker you need to make sure that the FHIR server container is in the same
docker network as the testdata generator.


## DEPLOY FOR REGULAR GENERATION USE

`docker-compose up`
