import { Application } from 'express';

const getRoutesOfLayer = (path: string, layer: any): string[] => {
  if (layer.method) {
    return [`${layer.method.toUpperCase()} ${path}`];
  }
  if (layer.route) {
    return getRoutesOfLayer(
      path + split(layer.route.path),
      layer.route.stack[0]
    );
  }
  if (layer.name === 'router' && layer.handle.stack) {
    let routes: string[] = [];
    layer.handle.stack.forEach((stackItem: any) => {
      routes = routes.concat(
        getRoutesOfLayer(path + split(layer.regexp), stackItem)
      );
    });
    return routes;
  }
  return [];
};

const split = (thing: any): string => {
  if (typeof thing === 'string') {
    return thing;
  }
  if (thing.fast_slash) {
    return '';
  }
  const match = thing
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
  return match
    ? match[1].replace(/\\(.)/g, '$1')
    : `<complex:${thing.toString()}>`;
};

export const printRoutes = (app: Application) => {
  let routes: string[] = [];
  app._router.stack.forEach((layer: any) => {
    routes = routes.concat(getRoutesOfLayer('', layer));
  });

  console.log('\nApp Routes:');
  routes.forEach((route) => console.log(`\t${route}`));
  console.log('\n');
};
