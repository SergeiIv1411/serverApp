const graphql = require("graphql");
const mongoose = require("mongoose");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = graphql;

const Categories = require("../models/category");
const Products = require("../models/product");

// const ImageType = new GraphQLObjectType({
//   name: "ImageType",
//   description: "Картинка товара",
//   fields: () => ({
//     image_id: { type: GraphQLString, description: "идентификатор фотографии" },
//   }),
// });

const FilterType = new GraphQLObjectType({
  name: "Фильтр",
  fields: () => ({}),
});

CategoryListType = new GraphQLObjectType({
  name: "CategoryListType",
  fields: () => ({
    _id: { type: GraphQLID },
  }),
});

const PackageType = new GraphQLObjectType({
  name: "PackageType",
  description: "Упаковки товара",
  fields: () => ({
    barcode: { type: GraphQLString, description: "штрихкод товара" },
    package_id: { type: GraphQLString, description: "id упаковки" },
    package_name: { type: GraphQLString, description: "упаковка" },
    price: { type: GraphQLFloat, description: "цена за упаковку" },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  description: "Категория сайта",
  fields: () => ({
    _id: { type: GraphQLID, description: "идентификатор категории" },
    // erp_id: {type: GraphQLID, description: 'идентификатор из erp', },
    name: { type: GraphQLString, description: "Наименование категории" },
    parentCategory: {
      type: CategoryType,
      description: "родительская категория",
      resolve(parent, args) {
        // return Categories.findOne({ erp_id: args.id });
        return Categories.findById(parent.parentId);
      },
    },
    parentId: {
      type: GraphQLID,
      description: "идентификатор родительской категории",
    },
    childrenCount: { type: GraphQLFloat },
    productCount: { type: GraphQLFloat },
    children: {
      type: new GraphQLList(CategoryType),
      description: "Дочерние категории",
      resolve(parent, args) {
        // return Categories.findOne({ erp_id: args.id });
        return Categories.find({ parentId: parent._id });
      },
    },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "Товары",
  fields: () => ({
    _id: { type: GraphQLID, description: "идентификатор товара" },
    name: { type: GraphQLString, description: "Наименование товара" },
    article: { type: GraphQLString, description: "Артикул" },
    description: { type: GraphQLString, description: "Описание товара" },
    weight: { type: GraphQLFloat, description: "Вес" },
    count: { type: graphql.GraphQLInt, description: "Количество" },
    priceForOne: { type: GraphQLFloat, description: "Цена за штуку" },
    new_product: { type: GraphQLBoolean, description: "Новинка" },
    sale: { type: GraphQLBoolean, description: "Товар со скидкой" },
    composition: { type: GraphQLString, description: "Состав" },
    // code: { type: GraphQLString, description: "код" },
    brand: { type: GraphQLString, description: "Брэнд" },
    // color: { type: GraphQLString, description: "Описание товара" },
    country: { type: GraphQLString, description: "Страна" },
    // size: { type: GraphQLString, description: "Размер" },
    // countInPackage: { type: GraphQLString, description: "Описание товара" },
    images: { type: new GraphQLList(GraphQLString) },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        // return Categories.findOne({ erp_id: args.id });
        return Categories.find({ _id: parent.categories });
      },
    },
    packages: { type: new GraphQLList(PackageType) },
    // images: {
    //     type: new GraphQLList(ImageType),
    //     description: 'Идентификатор картинки',
    // },
    // categories: { type: new GraphQLList({
    //     type: GraphQLID,
    //     ref: "Category"
    // })},
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  description: "Api Triol Market",
  fields: {
    categoryByID: {
      type: CategoryType,
      description: "Возвращает категорию по уникальному идентификатору",
      args: { id: { type: GraphQLID, description: "идентификатор категории" } },
      resolve(parent, args) {
        // return Categories.findOne({ erp_id: args.id });
        return Categories.findById(args.id);
      },
    },
    categoryByParent: {
      type: new GraphQLList(CategoryType),
      description: "Возвращает массив категорий по id родителя",
      args: {
        parentId: {
          type: GraphQLID,
          description: "идентификатор родительской категории",
        },
      },
      resolve(parent, args) {
        return Categories.find({ parentId: args.parentId });
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      description: "Возвращает список категорий",
      resolve(parent, args) {
        return Categories.find({});
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      description: "Возвращает список товаров",
      args: {
        limit: {
          type: graphql.GraphQLInt,
          description: "количество возвращаемых записей",
        },
        offset: {
          type: graphql.GraphQLInt,
          description: "количество пропускаемых записей",
        },
      },
      resolve(parent, args) {
        return Products.find({}).limit(args.limit).skip(args.offset).sort("_id");
      },
    },
    productDetail: {
      type: ProductType,
      description: "Информация по товару с отбором по уникальному идентификатору",
      args: {
        id: {
          type: graphql.GraphQLID,
          description: "Идентификатор товара",
        },
      },
      resolve(parent, args) {
        return Products.findById(args.id);
      },
    },
    categoryProducts: {
      type: new GraphQLList(ProductType),
      description: "Возвращает список товаров категории",
      args: {
        category_id: {
          type: GraphQLID,
          description: "идентификатор категории",
        },
        pageSize: {
          type: graphql.GraphQLInt,
          description: "Размер страницы",
        },
        currentPage: {
          type: graphql.GraphQLInt,
          description: "ТекущаяСтраница",
        },
      },
    async resolve(parent, args) {
          const skip = args.pageSize * (args.currentPage - 1);
          
        return Products.find({categories: args.category_id}).limit(args.pageSize).skip(skip).sort("_id");
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
});
