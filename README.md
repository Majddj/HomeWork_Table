# БГУИР Notes

Учебный помощник для групп, заметок и домашних заданий. Интерфейс построен по мобильному референсу: домашний экран со статистикой, список групп, список заметок, просмотр заметки и редактор заметок.

## Возможности

- создание и удаление учебных групп;
- создание, редактирование, удаление и завершение заметок;
- поиск заметок;
- локальное хранение данных через AsyncStorage;
- нижняя навигация Home / Groups / Search / Profile;
- запуск на iOS, Android и web;
- PWA-сборка для браузера.

## Стек

- Expo SDK 57;
- React Native 0.86;
- React 19;
- TypeScript;
- React Native Web;
- AsyncStorage;
- GitHub Actions + GitHub Pages.

## Архитектура

```text
src/
  App.tsx                         # Навигация и orchestration состояния
  theme.ts                        # Цвета, тени и дизайн-токены
  domain/
    types.ts                      # Group, Note, AppSnapshot
    storage.ts                    # Начальные данные и AsyncStorage
  components/
    BottomNav.tsx                 # Нижняя навигация
    ScreenHeader.tsx              # Единая шапка экранов
  features/
    home/HomeScreen.tsx           # Домашний экран
    groups/GroupListScreen.tsx    # Список групп
    groups/CreateGroupModal.tsx   # Создание группы
    notes/NotesListScreen.tsx     # Заметки внутри группы
    notes/NoteDetailScreen.tsx    # Просмотр заметки
    notes/NoteEditorModal.tsx     # Создание и редактирование
    search/SearchScreen.tsx       # Поиск
    profile/ProfileScreen.tsx     # Профиль и статистика
```

`App.tsx` отвечает только за выбор экрана, выбранную группу или заметку и CRUD-операции. Данные описаны в `domain`, а UI разделён по пользовательским сценариям в `features`.

## Запуск

```bash
npm install
npx expo start
```

Открыть web-версию:

```bash
npx expo start --web
```

Открыть на конкретной платформе:

```bash
npx expo start --ios
npx expo start --android
```

## Проверка проекта

```bash
npx tsc --noEmit
npx expo-doctor
npm run build:web
```

## Деплой на GitHub Pages

В репозитории есть `.github/workflows/deploy.yml`. Workflow автоматически собирает web-версию и публикует папку `dist`.

1. Создай пустой репозиторий на GitHub.
2. Подключи его к локальному проекту:

```bash
git init
git add .
git commit -m "Build BSUIR notes app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

3. На GitHub открой `Settings -> Pages`.
4. В `Build and deployment` выбери `GitHub Actions`.
5. После каждого push в `main` workflow выполнит `npm ci`, `npm run build:web` и задеплоит `dist`.

Сайт будет доступен по адресу:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

Если remote уже существует:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## Данные

Backend в проекте не используется. Группы и заметки сохраняются локально на устройстве или в браузере. При очистке данных браузера web-данные будут удалены.
