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
  uploadImages: string;
  dragToReorder: string;
  uploading: string;
  dropHere: string;
  orClickToSelect: string;
  firstImageMain: string;
  deleteImageConfirm: string;
  deleteImageTitle: string;
  deleting: string;
  bookings: string;
  bookingsAndMessages: string;
  manageBookingsAndMessages: string;
  bookingsList: string;
  contactMessages: string;
  filters: string;
  search: string;
  searchPlaceholder: string;
  dateFrom: string;
  dateTo: string;
  paymentStatus: string;
  bookingStatus: string;
  all: string;
  pending: string;
  paid: string;
  failed: string;
  confirmed: string;
  completed: string;
  cancelled: string;
  clearFilters: string;
  customer: string;
  product: string;
  tourDate: string;
  price: string;
  status: string;
  noBookingsFound: string;
  noMessagesFound: string;
  showing: string;
  of: string;
  contact: string;
  message: string;
  telegram: string;
  telegramStatus: string;
  sent: string;
  notSent: string;
  bookingDetails: string;
  messageDetails: string;
  customerInfo: string;
  bookingInfo: string;
  specialRequests: string;
  contactInfo: string;
  details: string;
  phone: string;
  country: string;
  yourRole: string;
  adminRole: string;
  userRole: string;
  permissions: string;
  viewProducts: string;
  editProducts: string;
  viewBookings: string;
  deleteItems: string;
  cannotDelete: string;
  calendar: string;
  bookingStatistics: string;
  totalBookings: string;
  thisMonth: string;
  thisWeek: string;
  allTime: string;
  bookingsPerWeek: string;
  bookingsPerMonth: string;
  messageStatistics: string;
  totalMessages: string;
  messagesPerDay: string;
  messagesPerWeek: string;
  messagesPerMonth: string;
  scheduleCalendar: string;
  viewSchedule: string;
  bookingsFor: string;
  noBookingsForDate: string;
  today: string;
  monthView: string;
  previousMonth: string;
  nextMonth: string;
  bookingsCount: string;
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
    uploadImages: 'Upload Images',
    dragToReorder: 'Drag images to reorder. First image will be the main image.',
    uploading: 'Uploading...',
    dropHere: 'Drop images here',
    orClickToSelect: 'or click to select files',
    firstImageMain: 'The first image (marked "Main") will be displayed as the primary image.',
    deleteImageConfirm: 'Are you sure you want to delete this image? This action cannot be undone.',
    deleteImageTitle: 'Delete Image',
    deleting: 'Deleting...',
    bookings: 'Bookings',
    bookingsAndMessages: 'Bookings & Messages',
    manageBookingsAndMessages: 'Manage customer bookings and contact messages',
    bookingsList: 'Bookings List',
    contactMessages: 'Contact Messages',
    filters: 'Filters',
    search: 'Search',
    searchPlaceholder: 'Search by name, email, phone...',
    dateFrom: 'Date From',
    dateTo: 'Date To',
    paymentStatus: 'Payment Status',
    bookingStatus: 'Booking Status',
    all: 'All',
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    clearFilters: 'Clear filters',
    customer: 'Customer',
    product: 'Product',
    tourDate: 'Tour Date',
    price: 'Price',
    status: 'Status',
    noBookingsFound: 'No bookings found',
    noMessagesFound: 'No messages found',
    showing: 'Showing',
    of: 'of',
    contact: 'Contact',
    message: 'Message',
    telegram: 'Telegram',
    telegramStatus: 'Telegram Status',
    sent: 'Sent',
    notSent: 'Not Sent',
    bookingDetails: 'Booking Details',
    messageDetails: 'Message Details',
    customerInfo: 'Customer Information',
    bookingInfo: 'Booking Information',
    specialRequests: 'Special Requests',
    contactInfo: 'Contact Information',
    details: 'Details',
    phone: 'Phone',
    country: 'Country',
    yourRole: 'Your Role',
    adminRole: 'Admin',
    userRole: 'User',
    permissions: 'Permissions',
    viewProducts: 'View all products',
    editProducts: 'Create and edit products',
    viewBookings: 'View and manage bookings',
    deleteItems: 'Delete products and bookings',
    cannotDelete: 'Cannot delete items (Admin only)',
    calendar: 'Calendar',
    bookingStatistics: 'Booking Statistics',
    totalBookings: 'Total Bookings',
    thisMonth: 'This Month',
    thisWeek: 'This Week',
    allTime: 'All Time',
    bookingsPerWeek: 'Bookings per Week',
    bookingsPerMonth: 'Bookings per Month',
    messageStatistics: 'Message Statistics',
    totalMessages: 'Total Messages',
    messagesPerDay: 'Messages per Day',
    messagesPerWeek: 'Messages per Week',
    messagesPerMonth: 'Messages per Month',
    scheduleCalendar: 'Schedule Calendar',
    viewSchedule: 'View your tour schedule at a glance',
    bookingsFor: 'Bookings for',
    noBookingsForDate: 'No bookings for this date',
    today: 'Today',
    monthView: 'Month View',
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
    bookingsCount: 'bookings',
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
    uploadImages: 'Загрузить изображения',
    dragToReorder: 'Перетащите изображения для изменения порядка. Первое изображение будет главным.',
    uploading: 'Загрузка...',
    dropHere: 'Перетащите изображения сюда',
    orClickToSelect: 'или нажмите для выбора файлов',
    firstImageMain: 'Первое изображение (отмечено "Main") будет отображаться как главное.',
    deleteImageConfirm: 'Вы уверены, что хотите удалить это изображение? Это действие нельзя отменить.',
    deleteImageTitle: 'Удалить изображение',
    deleting: 'Удаление...',
    bookings: 'Бронирования',
    bookingsAndMessages: 'Бронирования и сообщения',
    manageBookingsAndMessages: 'Управление бронированиями и сообщениями клиентов',
    bookingsList: 'Список бронирований',
    contactMessages: 'Сообщения',
    filters: 'Фильтры',
    search: 'Поиск',
    searchPlaceholder: 'Поиск по имени, email, телефону...',
    dateFrom: 'Дата от',
    dateTo: 'Дата до',
    paymentStatus: 'Статус оплаты',
    bookingStatus: 'Статус бронирования',
    all: 'Все',
    pending: 'Ожидает',
    paid: 'Оплачено',
    failed: 'Ошибка',
    confirmed: 'Подтверждено',
    completed: 'Завершено',
    cancelled: 'Отменено',
    clearFilters: 'Очистить фильтры',
    customer: 'Клиент',
    product: 'Продукт',
    tourDate: 'Дата тура',
    price: 'Цена',
    status: 'Статус',
    noBookingsFound: 'Бронирования не найдены',
    noMessagesFound: 'Сообщения не найдены',
    showing: 'Показано',
    of: 'из',
    contact: 'Контакт',
    message: 'Сообщение',
    telegram: 'Telegram',
    telegramStatus: 'Статус Telegram',
    sent: 'Отправлено',
    notSent: 'Не отправлено',
    bookingDetails: 'Детали бронирования',
    messageDetails: 'Детали сообщения',
    customerInfo: 'Информация о клиенте',
    bookingInfo: 'Информация о бронировании',
    specialRequests: 'Особые пожелания',
    contactInfo: 'Контактная информация',
    details: 'Детали',
    phone: 'Телефон',
    country: 'Страна',
    yourRole: 'Ваша роль',
    adminRole: 'Администратор',
    userRole: 'Пользователь',
    permissions: 'Разрешения',
    viewProducts: 'Просмотр всех продуктов',
    editProducts: 'Создание и редактирование продуктов',
    viewBookings: 'Просмотр и управление бронированиями',
    deleteItems: 'Удаление продуктов и бронирований',
    cannotDelete: 'Невозможно удалять элементы (только для администратора)',
    calendar: 'Календарь',
    bookingStatistics: 'Статистика бронирований',
    totalBookings: 'Всего бронирований',
    thisMonth: 'В этом месяце',
    thisWeek: 'На этой неделе',
    allTime: 'За все время',
    bookingsPerWeek: 'Бронирований в неделю',
    bookingsPerMonth: 'Бронирований в месяц',
    messageStatistics: 'Статистика сообщений',
    totalMessages: 'Всего сообщений',
    messagesPerDay: 'Сообщений в день',
    messagesPerWeek: 'Сообщений в неделю',
    messagesPerMonth: 'Сообщений в месяц',
    scheduleCalendar: 'Календарь расписания',
    viewSchedule: 'Просмотр расписания туров',
    bookingsFor: 'Бронирования на',
    noBookingsForDate: 'Нет бронирований на эту дату',
    today: 'Сегодня',
    monthView: 'Вид месяца',
    previousMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    bookingsCount: 'бронирований',
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
