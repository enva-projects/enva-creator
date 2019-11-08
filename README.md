# enva-creator

Enva-Creator is responsible for generating files and folders based on variables which are being asked users.

# Installation

```bash
$ npm i -g @enva/creator
$ yarn global add @enva/creator
```

# Usage

First you need to create a folder with the name of `.enva` and put a folder called `creator` in it. After that you can use enva-creator in 2 different concepts: `standAlone` and `withController`.

## StandAlone

For example you create `component.enva` file in the `.enva/creator`:
```javascript

<%
  $NAME = ask('What is the name of the component?');
%>

import React from 'react';

export default function <=$NAME>(){
  return (<></>)
}

<%
  output($NAME + '.js');
%>

```
And after that do:

```javascript

import envaCreator from '@enva/creator';

envaCreator('component');

```

## WithController

Create a folder inside the `.enva/creator` and put a file called `controller.enva` in it.

Controller is responsible for asking questions and deciding which file to execute. For example:

```javascript
// .enva/creator/component/controller.enva

$NAME = ask('What is the component name?');
$TYPE = ask('What is the type of it?');

if($TYPE === 'functional'){
  exec('functional.enva', {
    NAME: $NAME
  });
} else {
  exec('class.enva', {
    NAME: $NAME
  });
}

```

```javascript
// .enva/creator/component/functional.enva

import React from 'react';

export default function <=$$NAME>(){
  return (<></>);
}

<%
  output($$NAME + '.js');
%>

```

```javascript
// .enva/creator/component/class.enva

import React from 'react';

export default class <=$$NAME>{
  constructor(props){
    super(props);
  }
  render(){
    return (<></>);
  }
}

<%
  output($$NAME + '.js');
%>

```

# Use with @enva/cli

Install @enva/creator and add this to the .envarc:

```JSON
{
  "plugins": [
    {
      "name": "@enva/creator",
      "command": "ec"
    }
  ]
}

```

And after that it will be available like:

```bash
$ enva ec <FILENAME>
```