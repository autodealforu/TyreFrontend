// Shared UI types that were previously declared in the old homepage component
export type IBanner = {
  _id?: string;
  name?: string;
  banner_type?: 'image' | 'video';
  title?: string;
  subtitle?: string;
  image: string;
  video?: string;
  mobile_banner?: string;
  product_collection: {
    _id: string;
  };
};

export type INamedComponents = {
  name: string;
  _id: string;
};
