import { createContext, useContext, useState, ReactNode } from 'react';

type AdminLang = 'en' | 'ru';

interface AdminTranslations {
  adminPanel: string;
  products: string;
  dashboard: string;
  backToWebsite: string;
  signOut: string;
  addProduct: string;
  editProduct: string;
  createProduct: string;
  updateProductDetails: string;
  addNewProduct: string;
  manageProducts: string;
  total: string;
  noProducts: string;
  name: string;
  description: string;
  features: string;
  created: string;
  actions: string;
  edit: string;
  delete: string;
  deleteProduct: string;
  deleteConfirmTitle: string;
  deleteConfirmText: string;
  cancel: string;
  productDeleted: string;
  productUpdated: string;
  productCreated: string;
  generalSettings: string;
  pricePerDay: string;
  priority: string;
  priorityNotSet: string;
  priorityHint: string;
  active: string;
  activeHint: string;
  images: string;
  imageUrls: string;
  imageUrlsHint: string;
  translations: string;
  featuresHint: string;
  location: string;
  category: string;
  selectCategory: string;
  updateProduct: string;
  signIn: string;
  signingIn: string;
  email: string;
  password: string;
  invalidCredentials: string;
  signInToManage: string;
  comingSoon: string;
  dashboardDescription: string;
  welcomeToDashboard: string;
  untitled: string;
}

const translations: Record<AdminLang, AdminTranslations> = {
  en: {
    adminPanel: 'Admin Panel',
    products: 'Products',
    dashboard: 'Dashboard',
    backToWebsite: 'Back to Website',
    signOut: 'Sign Out',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    createProduct: 'Create Product',
    updateProductDetails: 'Update product details',
    addNewProduct: 'Add a new product to your catalog',
    manageProducts: 'Manage your tour products',
    total: 'total',
    noProducts: 'No products found. Create your first product.',
    name: 'Name',
    description: 'Description',
    features: 'Features',
    created: 'Created',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    deleteProduct: 'Delete Product',
    deleteConfirmTitle: 'This action cannot be undone.',
    deleteConfirmText: 'Are you sure you want to delete this product? All associated data will be permanently removed.',
    cancel: 'Cancel',
    productDeleted: 'Product deleted successfully',
    productUpdated: 'Product updated',
    productCreated: 'Product created',
    generalSettings: 'General Settings',
    pricePerDay: 'Price per day (THB)',
    priority: 'Priority',
    priorityNotSet: 'Not set (last)',
    priorityHint: 'Lower = appears first',
    active: 'Active',
    activeHint: 'Active (visible on website)',
    images: 'Images',
    imageUrls: 'Image URLs (comma-separated)',
    imageUrlsHint: 'Enter image URLs separated by commas',
    translations: 'Translations',
    featuresHint: 'Enter features separated by commas',
    location: 'Location',
    category: 'Category',
    selectCategory: 'Select category',
    updateProduct: 'Update Product',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    email: 'Email',
    password: 'Password',
    invalidCredentials: 'Invalid email or password',
    signInToManage: 'Sign in to manage your tours',
    comingSoon: 'Coming Soon',
    dashboardDescription: 'This dashboard will be expanded with analytics, charts, and more management tools. For now, you can manage your products using the Products tab.',
    welcomeToDashboard: 'Welcome to your admin dashboard',
    untitled: 'Untitled',
  },
  ru: {
    adminPanel: 'Панель администратора',
    products: 'Продукты',
    dashboard: 'Панель управления',
    backToWebsite: 'Вернуться на сайт',
    signOut: 'Выйти',
    addProduct: 'Добавить продукт',
    editProduct: 'Редактировать продукт',
    createProduct: 'Создать продукт',
    updateProductDetails: 'Обновить данные продукта',
    addNewProduct: 'Добавить новый продукт в каталог',
    manageProducts: 'Управление турами',
    total: 'всего',
    noProducts: 'Продукты не найдены. Создайте первый продукт.',
    name: 'Название',
    description: 'Описание',
    features: 'Особенности',
    created: 'Создан',
    actions: 'Действия',
    edit: 'Редактировать',
    delete: 'Удалить',
    deleteProduct: 'Удалить продукт',
    deleteConfirmTitle: 'Это действие нельзя отменить.',
    deleteConfirmText: 'Вы уверены, что хотите удалить этот продукт? Все связанные данные будут удалены навсегда.',
    cancel: 'Отмена',
    productDeleted: 'Продукт успешно удален',
    productUpdated: 'Продукт обновлен',
    productCreated: 'Продукт создан',
    generalSettings: 'Основные настройки',
    pricePerDay: 'Цена за день (THB)',
    priority: 'Приоритет',
    priorityNotSet: 'Не установлен (последний)',
    priorityHint: 'Меньше = отображается первым',
    active: 'Активный',
    activeHint: 'Активный (виден на сайте)',
    images: 'Изображения',
    imageUrls: 'URL изображений (через запятую)',
    imageUrlsHint: 'Введите URL изображений через запятую',
    translations: 'Переводы',
    featuresHint: 'Введите особенности через запятую',
    location: 'Местоположение',
    category: 'Категория',
    selectCategory: 'Выберите категорию',
    updateProduct: 'Обновить продукт',
    signIn: 'Войти',
    signingIn: 'Вход...',
    email: 'Email',
    password: 'Пароль',
    invalidCredentials: 'Неверный email или пароль',
    signInToManage: 'Войдите для управления турами',
    comingSoon: 'Скоро',
    dashboardDescription: 'Эта панель будет расширена аналитикой, графиками и другими инструментами управления. Пока вы можете управлять продуктами во вкладке Продукты.',
    welcomeToDashboard: 'Добро пожаловать в панель администратора',
    untitled: 'Без названия',
  },
};

interface AdminLanguageContextType {
  lang: AdminLang;
  setLang: (lang: AdminLang) => void;
  t: AdminTranslations;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<AdminLang>(() => {
    const saved = localStorage.getItem('adminLang');
    return (saved === 'ru' || saved === 'en') ? saved : 'en';
  });

  const handleSetLang = (newLang: AdminLang) => {
    setLang(newLang);
    localStorage.setItem('adminLang', newLang);
  };

  return (
    <AdminLanguageContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLang() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLang must be used within AdminLanguageProvider');
  }
  return context;
}
