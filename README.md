# Test WebXR App!!!

A WebXR application using Three.js and RATK, aiming to create a spatial computing environment similar to Apple's Vision Pro (AVP) for the Oculus Quest 2. This project will gradually develop features like passthrough environments, window creation, hand tracking, and persistent anchors.

## Features

- **Basic WebXR Scene**: Initial setup for WebXR rendering.
- **Window Creation**: Ability to create and position multiple windows in the AR environment.
- **Hand Tracking**: Utilize hand tracking for interaction within the AR space.
- **Persistent Anchors**: Save and restore the position of windows between sessions.
- **Window Movement**: Allow users to move and reposition windows.
- **Styling/Design**: Implement fluid and intuitive movement and styling for windows.
- **Window Content**: Display content within windows, potentially displaying html, using iframes or other embedded elements.

## Todo

- [ ] Setup basic WebXR scene
- [ ] Passthrough
- [ ] Allow for creation of windows
- [ ] Hand tracking
- [ ] Persistent anchors (come back, windows in the same place)
- [ ] Move windows
- [ ] Styling/Design -> fluid movement
- [ ] Window content -> maybe iframe or similar?

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Slaymish/WebXRApp.git
   cd WebXRApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run serve
   ```

4. Open your browser on your quest and navigate to `http://<lan-ip>:1234`.


## To use prompt_maker.py in development

- You'll have the option to save the contents to your clipboard
- Basically just lists all the files in the dir (using tree -L 2)
- As well as the contents of each files
- Useful for sending to an LLM when you need help/advice on the project

```bash
cd src/
python -m venv venv
source venv/bin/activate
pip install pyperclip
python3 prompt_maker.py
```


## Development Notes

### Basic WebXR Scene

Set up the initial Three.js scene and integrate with RATK for AR functionality.

### Window Creation

Create a system to instantiate and place windows within the AR environment. Consider using Three.js planes or other geometries to represent windows.

### Hand Tracking

Implement hand tracking using available WebXR hand tracking APIs. This will allow for more natural interaction within the AR environment.

### Persistent Anchors

Use WebXR's anchor system to save the position and state of windows, so they can be restored in the same place when the app is reopened.

### Window Movement

Allow users to click and drag (or use hand gestures) to move windows around within the AR space.

### Styling and Design

Focus on the visual and interactive design of the windows, ensuring smooth and fluid movements, and intuitive user interactions.

### Window Content

Explore options for displaying dynamic content within the windows, such as iframes for web content, live video streams, or interactive 3D objects.

## Future Ideas

- Specialized windows, like a PC screen streamer or a 3D orb for ChatGPT interactions.
- Enhanced interaction techniques, such as voice commands or advanced gesture recognition.
- Integration with other AR/VR devices for a broader user experience.
