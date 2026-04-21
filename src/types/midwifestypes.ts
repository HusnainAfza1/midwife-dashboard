export interface SubCategoryItem {
    id: string;
    name: string;
    included: boolean;
  }
  
  export interface SubCategory {
    id: string;
    title: string;
    items: SubCategoryItem[];
  }
  
  export interface MidwifeType {
    id: string;
    title: string;
    description: string;
    features: string[];
    hasSubCategories: boolean;
    subCategories?: string[]; 
  }
  
  export interface MidwifeServices {
    id: string;
    title: string;
    items: SubCategoryItem[];
  }   