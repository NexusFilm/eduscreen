# EduScreen - Updated Configuration & Logic Guide

📌 **Overview**  
EduScreen is a widget-based digital classroom where the primary dashboard is a whiteboard. Users can create up to 5 free class workspaces, each with customizable widgets. Uploading images to the whiteboard is a core feature, enabling teachers to visually enhance lessons.

🎯 **Development Philosophy & Best Practices**
1️⃣ **Proactive Enhancement**
   - Anticipate user needs and suggest improvements
   - Implement industry best practices without explicit requests
   - Consider accessibility and user experience by default

2️⃣ **Feature Implementation Strategy**
   - Always choose the most robust, future-proof solution
   - Consider scalability and maintainability
   - Implement features with room for natural expansion

3️⃣ **User Experience Priority**
   - Focus on intuitive interactions
   - Provide helpful defaults and suggestions
   - Ensure smooth transitions and responsive design

🔑 **Core Features**  
✅ Login & User Authentication  
✅ Whiteboard-Centered Dashboard ✨  
✅ Drag & Drop Photo Uploads 📸  
✅ Save & Load Presets (Classes)  
✅ 5 Free Workspaces, Paid Upgrades  
✅ **Persistent Widget Visibility**: Timer, Quick Notes, and Calculator widgets will remain visible upon refreshing the website unless saved as a class preset by the user.

🎛️ **Key Widgets (Integrated into Whiteboard)**  
1️⃣ **Whiteboard (Main Dashboard) 📝**  
   - Drawing Tools: Pen, Eraser, Colors  
   - Text Notes: Add and move text freely  
   - Photo Upload: Drag & drop images onto the board  
   - Multi-User Collaboration (Future Upgrade)  

2️⃣ **Timer Widget ⏳**  
   - Countdown or stopwatch  
   - Sound alert when finished  
   - Adjustable duration  

3️⃣ **Sticky Notes Widget 🗒️**  
   - Virtual sticky notes  
   - Color-coded organization  
   - Drag & drop anywhere  

4️⃣ **Poll & Voting Widget 📊**  
   - Create quick polls  
   - Real-time updates  
   - Graph-style results  

5️⃣ **File Upload Widget 📂**  
   - Upload lesson materials  
   - Students can download  
   - Auto-delete option  

🖼️ **Image Upload Logic (Whiteboard Feature)**  
Users Can:  
✅ Drag and drop images onto the whiteboard  
✅ Resize and move images freely  
✅ Save board state with images attached  

**Backend Logic:**  
- **Upload Handling** – Store images in a cloud service (Firebase Storage, AWS S3, or local storage).  
- **Database Entry** – Each uploaded image is linked to the user's class session.  
- **Rendering on Whiteboard** – Fetch image URLs from the database and load them onto the board.  

**Example Data Structure for Saved Whiteboard State:**

```json
{
  "userId": "12345",
  "className": "Math Period 1",
  "whiteboard": {
    "drawings": [],
    "textNotes": [
      { "text": "Today's Topic: Algebra", "position": { "x": 100, "y": 50 } }
    ],
    "images": [
      { "url": "https://storage.eduScreen.com/image1.png", "position": { "x": 200, "y": 150 }, "size": { "width": 300, "height": 200 } }
    ]
  }
}
```

🚀 **Upgradeable Features (Paid Tier)**  
🔹 More than 5 class presets  
🔹 Advanced widgets (collaborative board, AI-assisted tools)  
🔹 Custom branding & themes  
🔹 Multi-user live editing  

🛠️ **Logic Implementation (Cursor AI Backend)**  
1️⃣ **User Authentication (Login/Signup)**  
   - Email/password login (Auth0, Firebase, or custom auth).  
   - Assign account type (Free or Premium).  

2️⃣ **Whiteboard as Default Dashboard**  
   - Load saved whiteboard state (if available).  
   - Allow drawing, text input, and image uploads.  

3️⃣ **Image Upload Process**  
   - Drag & drop support for images.  
   - Backend stores image in cloud/local storage.  
   - Database entry for whiteboard session.  
   - Images persist after saving & reloading.  

4️⃣ **Save & Load Presets**  
   - Users can save their whiteboard and widget layout as a class preset.  
   - Free users are limited to 5 presets.  
   - Upgrade prompt for additional presets.  

📌 **Next Steps**  
✅ Build UI for Whiteboard & Image Upload  
✅ Database to Store Whiteboard Data  
✅ Optimize for Mobile & Tablet  
✅ Subscription System for Premium Users  

🎛️ **Widget Enhancement Guidelines**
When implementing or updating widgets:
1. Add predictive/autocomplete features where applicable
2. Include expandable/collapsible views for better content visibility
3. Implement keyboard shortcuts and accessibility features
4. Add loading states and error handling
5. Consider mobile responsiveness
6. Include helpful tooltips and user guidance
7. Optimize performance and lazy loading
8. Implement data persistence where appropriate

🔧 **Backend Implementation with Supabase Edge Functions**

1️⃣ **Supabase Project Setup**
   - Create new Supabase project
   - Configure Edge Functions
   - Set up authentication and storage
   - Deploy via Vercel for frontend only

2️⃣ **Edge Functions Structure**
```typescript
// /supabase/functions/auth/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )
  
  // Handle auth operations
  return new Response(
    JSON.stringify({ message: 'Success' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

3️⃣ **API Endpoints via Edge Functions**
   - `/auth/*` - Authentication routes
   - `/classes/*` - Class management
   - `/documents/*` - Document operations
   - `/media/*` - Media upload/management
   - `/users/*` - User management

4️⃣ **Database Schema (Supabase)**
```sql
-- Users (handled by Supabase Auth)
-- Classes
create table classes (
  id bigint generated by default as identity primary key,
  name text not null,
  user_id uuid references auth.users(id),
  theme text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents
create table documents (
  id bigint generated by default as identity primary key,
  title text not null,
  content text,
  class_id bigint references classes(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Media
create table media (
  id bigint generated by default as identity primary key,
  url text not null,
  type text,
  document_id bigint references documents(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

5️⃣ **Authentication Flow**
   - Supabase Auth integration
   - JWT token handling via Supabase
   - Row Level Security (RLS) policies
   - Role-based access control

6️⃣ **Media Storage**
   - Supabase Storage for media files
   - Bucket organization
   - RLS policies for secure access
   - CDN optimization

7️⃣ **Environment Variables**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Vercel (Frontend Only)
NEXT_PUBLIC_URL=your-frontend-url

# Optional: External Services
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

8️⃣ **Frontend Integration**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// lib/api.ts
export const api = {
  async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
    return { data, error }
  },

  async uploadMedia(file: File) {
    const { data, error } = await supabase
      .storage
      .from('media')
      .upload(`${Date.now()}-${file.name}`, file)
    return { data, error }
  }
}
```

📝 **Next Steps**
1. Set up Supabase project
2. Configure Edge Functions
3. Implement database schema and RLS
4. Set up storage buckets
5. Deploy Edge Functions
6. Update frontend to use Supabase client
7. Configure Vercel for frontend deployment
8. Test end-to-end functionality

🔒 **Security Considerations**
- Enable HTTPS only
- Implement proper CORS policies
- Use secure session management
- Regular security audits
- Input sanitization
- Rate limiting
- API authentication
- Data encryption

📈 **Scaling Considerations**
- Database connection pooling
- Caching strategies
- CDN integration
- Serverless function optimization
- Database indexing
- Query optimization
- Load balancing

🎛️ **Layout Structure & UI Components**

1️⃣ **Main Layout Sections**
   ```
   +-----------------+-------------------+------------------+
   |                 |                   |                 |
   | Media Panel     |  Whiteboard       |  Widget Panel   |
   | (Left Panel)    |  (Center Panel)   |  (Right Panel)  |
   |                 |                   |                 |
   +-----------------+-------------------+------------------+
   ```

2️⃣ **Section Nicknames & Components**

   A. **Media Panel** (Left Panel - 400px width)
      - "YT-Player": Video Player (YouTube Logo)
      - "YT-Music": YouTube Music Player
      - Components:
        - Search bar
        - Video/Music list
        - Player controls
        - Library section

   B. **Whiteboard** (Center Panel - flexible width)
      - "WB-Header": Top control bar
        - "Screen-Tabs": Screen/tab selector
        - "WB-Actions": New Document & Upload buttons
      - "WB-Canvas": Main content area
        - Document editor
        - File viewer
        - Empty state messaging

   C. **Widget Panel** (Right Panel - 800px width)
      - "Add-Widget": Circular plus button (fixed position below Auth-Button)
      - "Widget-Grid": Widget container
      - Standard Widgets:
        - "Timer-W": Timer widget (compact, no-scroll design)
        - "Notes-W": Quick Notes widget
        - "Calc-W": Calculator widget

3️⃣ **Header Components** (Top Bar)
   - "App-Logo": EduScreen logo
   - "Theme-Dots": Color theme selector
   - "Auth-Button": Sign in/out button
   - "Add-Widget-Btn": Circular plus button (positioned below Auth-Button)
     ```css
     .add-widget-btn {
       width: 48px;
       height: 48px;
       border-radius: 50%;
       background: var(--primary-color);
       box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
       position: fixed;
       right: 24px;
       top: 80px; /* Below Auth-Button */
       z-index: 100;
     }
     ```

4️⃣ **Widget Specifications**

   A. Timer Widget ("Timer-W")
      - Compact, single-view design (no scrolling required)
      - Components layout:
        ```
        +------------------------+
        |     Timer Label        |
        |  +------------------+  |
        |  |   Circular      |  |
        |  |   Progress      |  |
        |  |   Display       |  |
        |  +------------------+  |
        |    Control Buttons     |
        |    Alarm Selector      |
        +------------------------+
        ```
      - Fixed height to prevent scrolling
      - All controls visible in single view
      - Alarm type selector (Gentle, Standard, Urgent)

   B. Quick Notes Widget ("Notes-W")
      - Note input field
      - Notes list with delete capability
      - Sticky note visual style
      - Yellow theme by default

   C. Calculator Widget ("Calc-W")
      - Standard/Scientific mode toggle
      - Basic operations keypad
      - Memory functions
      - Expression display

5️⃣ **Media Player Features**

   A. YouTube Player ("YT-Player")
      - Search functionality
      - Video thumbnails
      - Save to library option
      - Library management

   B. YouTube Music ("YT-Music")
      - Music search
      - Playlist display
      - Playback controls
      - Progress bar
      - Radio feature

6️⃣ **Theme & Styling**
   - Color themes:
     ```css
     :root {
       --primary-color: #4F46E5;
       --secondary-color: #818CF8;
       --accent-color: #6EE7B7;
       --background-color: #F8FAFC;
       --surface-color: #FFFFFF;
       --text-color: #1E293B;
       --border-color: #E2E8F0;
       --hover-color: #F1F5F9;
     }
     ```
   - Consistent border radius: 0.75rem
   - Shadow styling: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
   - Transition timing: 200ms

7️⃣ **Responsive Breakpoints**
   ```css
   @media (max-width: 1600px) {
     --widget-section-width: 600px;
   }
   @media (max-width: 1200px) {
     /* Stack layout changes */
   }
   @media (max-width: 768px) {
     /* Mobile adaptations */
   }
   ```

8️⃣ **Widget Grid System**
   - Base widget size: 300px min-width
   - Widget sizes:
     - "1x1": Standard single unit (300px × 300px)
     - "1x2": Double height (300px × 600px)
     - "2x1": Double width (600px × 300px)
     - "2x2": Double width & height (600px × 600px)
   - Gap between widgets: 0.75rem
   - Auto-fit grid layout

9️⃣ **Widget-Specific Dimensions**
   A. Timer Widget ("Timer-W")
      - Size: 1x1 (300px × 300px)
      - Fixed height with no scroll
      - Components must fit within these dimensions:
        - Timer display: 120px diameter
        - Controls: 40px height
        - Alarm selector: 36px height

   B. Quick Notes Widget ("Notes-W")
      - Size: 1x2 (300px × 600px)
      - Scrollable content area
      - Components:
        - Input area: 80px height
        - Notes list: Flexible height with scroll
        - Add button: 40px height

   C. Calculator Widget ("Calc-W")
      - Size: 1x1 (300px × 300px)
      - Fixed height with no scroll
      - Components:
        - Display: 60px height
        - Keypad: 200px height
        - Mode toggle: 40px height

🔧 **Code Organization & Best Practices**

1️⃣ **File Structure & Component Organization**
   - Components should be organized by feature/widget type
   - Shared components go in a common directory
   - Keep related files close together
   ```
   src/
   ├── components/
   │   ├── widgets/         # Widget-specific components
   │   │   ├── Timer.tsx
   │   │   ├── Notes.tsx
   │   │   └── Calculator.tsx
   │   └── common/         # Shared components
   ├── lib/               # Utilities and services
   └── types/            # TypeScript type definitions
   ```

2️⃣ **Code Duplication Prevention**
   - Single Source of Truth: Each component should have ONE definitive implementation
   - Avoid duplicate component files (e.g., no separate Timer.tsx in different directories)
   - Use imports/exports to share components across the application
   - When extending functionality, modify the existing component rather than creating a new one
   - Use TypeScript interfaces and types from a central location (types.ts)

3️⃣ **Component Hierarchy**
   - Widget implementations should be in `src/components/widgets/`
   - Widget containers and layout components in `src/components/`
   - All widget types should be defined in `src/types.ts`
   - Follow naming convention: `WidgetName.tsx` for the component file

4️⃣ **State Management**
   - Keep state management consistent across components
   - Use shared hooks for common functionality
   - Maintain a single source for widget configurations
   - Share types and interfaces through central type definitions

🎛️ **Widget Layout Specifications**  
- Create a fixed **2x2 grid layout** for widgets.  
- Set each widget to **350x500 pixels**.  
- Maintain proper spacing with **1rem (16px)** gaps between widgets.  
- Make the widget section width exactly fit two widgets side by side (**700px + spacing**).  
- Allow **vertical scrolling** if more than 4 widgets are added.  
- Keep the layout **responsive** while maintaining the **2x2 grid structure**.  
- Ensure new widgets are positioned correctly in the grid.  