import { parse } from "querystring";

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === "site") {
    return true;
  }
  return window.location.hostname === "preview.pro.ant.design";
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === "development") {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split("?")[1]);

/**
 * 树转数组
 * @param tree 树结构数组, 子级数组字段名，如children
 * TODO: 未完成功能
 */
export const treeTransArray = (tree: any[], parentId: string = ""): any[] => {
  return tree.reduce(
    (arr, { children = [], ...item }) =>
      arr.concat(
        [{ ...item, parentId }],
        treeTransArray(children as any[], item.id)
      ),
    []
  );
};

/**
 * 数组转树
 * @param list 一纬数组
 * @param key 父级ID字段名称，如parentId
 */
export const arrayTransTree = (list: any[], key: string) => {
  const tree = list?.filter((parent: any) => {
    const branchArr = list.filter((child) => {
      return parent.id === child[key];
    });
    // eslint-disable-next-line no-param-reassign
    parent.children = [];
    if (branchArr.length > 0) {
      // eslint-disable-next-line no-param-reassign
      parent.children = branchArr;
    }
    return parent[key] === "";
  });
  return tree;
};
