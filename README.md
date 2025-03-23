
# GitHub Metrics Explorer

![GitHub Metrics Explorer](https://img.shields.io/badge/Status-Active-brightgreen)

A powerful web application for visualizing and comparing GitHub repository metrics and analytics. Monitor views, clones, stars, and more across multiple repositories.

## 🚀 Features

- **Repository Comparison**: Select and compare up to 5 GitHub repositories simultaneously
- **Comprehensive Analytics**: View stars, forks, traffic data, clones, and referring sites
- **Interactive Charts**: Visualize metrics with responsive, interactive charts
- **Secure Authentication**: Connect using your GitHub personal access token (no token storage on servers)
- **User-Friendly Interface**: Clean, modern UI with responsive design
- **Repository Search**: Find repositories by username or organization name

## 🖥️ Screenshots

*Add screenshots of your application here*

## 🛠️ Technologies

- **React** - UI components and state management
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Component library
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization
- **React Router** - Navigation
- **GitHub API** - Repository data

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub personal access token (with `repo` scope for private repositories)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### GitHub Token

This application requires a GitHub personal access token to access the GitHub API. To create one:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select the `repo` scope (for accessing private repositories) or `public_repo` (for public only)
4. Generate and copy the token
5. Paste it into the application when prompted

**Note**: Your token is stored only in your browser's localStorage and is never sent to our servers.

## 📖 Usage

1. **Authentication**: Enter your GitHub personal access token at the login screen
2. **Repository Selection**: Enter a GitHub username or organization and select repositories
3. **View Metrics**: Explore the various metrics available for each repository
4. **Compare**: View side-by-side metrics for multiple repositories

## 🔒 Privacy

This application:
- Stores data only in your browser's localStorage
- Makes requests directly to GitHub API
- Does not collect or transmit your personal data or tokens

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Project Structure

```
src/
├── components/     # UI components
├── services/       # API services
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
└── main.tsx        # Application entry point
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check issues page.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- GitHub API for providing repository metrics
- The open source community for amazing tools

---

Built with [Lovable](https://lovable.dev/projects/64cb5589-9b2a-474c-8ecf-aa6cb2641e74)
