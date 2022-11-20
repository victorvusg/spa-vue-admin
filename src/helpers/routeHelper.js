import { routes } from '@/route.js';

function getPath(pathName) {
  const route = routes.find((item) => {
    if (item.name && item.name.toLowerCase() === pathName.toLowerCase()) {
      return item;
    }

    if (item.children) {
      return item.children.find((childrenItem) => {
        if (childrenItem.name && childrenItem.name.toLowerCase() === pathName.toLowerCase()) {
          return childrenItem;
        }
        return null;
      });
    }
    return null;
  });
  return route ? route.path : null;
}

const routeHelper = {
  getPath,
};

export default routeHelper;
