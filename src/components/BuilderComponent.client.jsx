import {BuilderComponent, builder, Builder} from '@builder.io/react';
import ProductDetails from './ProductDetails.client';
import '@builder.io/widgets';
import ProductCard from './ProductCard';
builder.init('cda38653c81344cf8859bd15e4d8e30d');


// Builder's shopify proxy send flattened objects ( no nodes or edges, while hydrogen expect the original)
const unflattenProduct = (data) => {
  return {
    ...data,
    media: data.media || {
      edges: data.images.map((image) => ({
        node: {image: {...image, url: image.src}},
      })),
    },
    variants: {
      edges: data.variants.map((variant) => ({
        node: {
          ...variant,
          availableForSale: variant.availableForSale || variant.available,
          image: {
            ...variant.image,
            url: variant.image.src,
          },
        },
      })),
    },
    images: {
      edges: data.images.map((image) => ({node: {...image, url: image.src}})),
    },
  };
};

Builder.registerComponent(
  ({productReference}) => {
    if (productReference?.data) {
      const product = unflattenProduct(productReference?.data);
      // TODO lazy loaded product details
      return <ProductDetails product={product}></ProductDetails>;
    }
    if (Builder.isEditing) {
      return 'Pick a product';
    }
    return null;
  },
  {
    name: 'ProductDetails',
    inputs: [
      {
        friendlyName: 'Product',
        name: 'productReference',
        // shopifyProduct type is coming from Bulider's shopify integration
        // install shopify in builder.io/app/integrations and connect it to your hydrogen app
        type: `ShopifyProduct`,
      },
    ],
    image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/ereader.svg',
    description: 'Choose a product to show its details on page',
  },
);

Builder.registerComponent(
  ({productReference}) => {
    if (productReference?.data) {
      const product = translateData(productReference?.data);
      // TODO lazy loaded product details
      return <ProductCard product={product}></ProductCard>;
    }
    if (Builder.isEditing) {
      return 'Pick a product';
    }
    return null;
  },
  {
    name: 'ProductCard',
    inputs: [
      {
        friendlyName: 'Product',
        name: 'productReference',
        type: `ShopifyProduct`,
      },
    ],
    image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/box.svg',
    description: 'Choose a product to show its details on page',
  },
);

export default BuilderComponent;
