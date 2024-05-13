import React, { createContext, useContext, Suspense, useState, useEffect, useRef, Fragment } from 'react'
import useDynamicScript from './useDynamicScript';
import LoadingIcon from './Loading/loading';

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

function ModuleLoader(props) {
  const { ready, failed } = useDynamicScript({
    url: props.module && props.url
  });

  if (!props.module) {
    return <div className="flexStyle">No Such Component</div>;
  }

  if (!ready) {
    return <div className="flexStyle">Trying To Load Component ... {<LoadingIcon splineClass={"spline"} />}</div>;
  }

  if (failed) {
    return <div className="flexStyle">Component Not Available</div>;
  }

  const Component = React.lazy(
    loadComponent(props.scope, props.module)
  );
    // console.log(Component)
  return (
    <Suspense fallback={<LoadingIcon splineClass={"spline"} />}>
      {ready && <Component className="col-7" />}
    </Suspense>
  );
}

export default ModuleLoader;
