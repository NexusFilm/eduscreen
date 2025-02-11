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