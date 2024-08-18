document.getElementById('generateBox').addEventListener('click', function() {
    const width = document.getElementById('width').value;
    const length = document.getElementById('length').value;
    const height = document.getElementById('height').value;
    const thickness = document.getElementById('thickness').value;

    if (width && length && height && thickness) {
        generateBoxDesign(width, length, height, thickness);
    } else {
        alert('Please fill in all fields');
    }
});

function generateBoxDesign(width, length, height, thickness) {
    // All dimensions are in mm
    const margin = 10; // Margin around the design
    const circleDiameter = 6; // Diameter of the circle
    const circleRadius = circleDiameter / 2;

    // Define the SVG namespace
    const xmlns = "http://www.w3.org/2000/svg";
    
    // Calculate SVG dimensions
    const svgWidth = Math.max(width, length + height + margin * 2) + margin * 2;
    const svgHeight = height * 2 + length + margin * 4;
    
    // Create an SVG element
    const svg = document.createElementNS(xmlns, "svg");
    svg.setAttribute("width", `${svgWidth}mm`);
    svg.setAttribute("height", `${svgHeight}mm`);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("xmlns", xmlns);
    
    // Helper function to create a path
    function createPath(d, stroke = "#FF0000", strokeWidth = 0.5, fill = "none") {
        const path = document.createElementNS(xmlns, "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", stroke);
        path.setAttribute("stroke-width", strokeWidth);
        path.setAttribute("fill", fill);
        return path;
    }

    // Helper function to create a circle
    function createCircle(cx, cy, r, fill = "none", stroke = "#FF0000", strokeWidth = 0.5) {
        const circle = document.createElementNS(xmlns, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("fill", fill);
        circle.setAttribute("stroke", stroke);
        circle.setAttribute("stroke-width", strokeWidth);
        return circle;
    }

    // Helper function to create text with dimensions
    function createText(x, y, content, fontSize) {
        const text = document.createElementNS(xmlns, "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("font-size", fontSize);
        text.setAttribute("text-anchor", "end");
        text.setAttribute("alignment-baseline", "baseline");
        text.setAttribute("fill", "#000000"); // Black text color
        text.textContent = content;
        return text;
    }

    // Calculate the panel sizes
    const topBottomWidth = width;
    const topBottomLength = length;
    const sideWidth = width - 2 * thickness;
    const sideHeight = height - 2 * thickness;
    const frontBackWidth = length;
    const frontBackHeight = height - 2 * thickness;

    // Define hole positions
    function addHoles(panelType, xOffset, yOffset) {
        let positions = [];
        if (panelType === 'top' || panelType === 'bottom') {
            const distance = thickness + 8;
            positions = [
                { x: xOffset + distance, y: yOffset + distance },
                { x: xOffset + topBottomWidth - distance, y: yOffset + distance },
                { x: xOffset + distance, y: yOffset + topBottomLength - distance },
                { x: xOffset + topBottomWidth - distance, y: yOffset + topBottomLength - distance }
            ];
            
            // Add middle holes if width or length > 400mm
            if (width >= 400) {
                positions.push({ x: xOffset + topBottomWidth / 2, y: yOffset + distance });
                positions.push({ x: xOffset + topBottomWidth / 2, y: yOffset + topBottomLength - distance });
            }
            if (length >= 400) {
                positions.push({ x: xOffset + distance, y: yOffset + topBottomLength / 2 });
                positions.push({ x: xOffset + topBottomWidth - distance, y: yOffset + topBottomLength / 2 });
            }
        } else if (panelType === 'left' || panelType === 'right') {
            const distance = thickness + 5;
            positions = [
                { x: xOffset + distance, y: yOffset + distance },
                { x: xOffset + sideWidth - distance, y: yOffset + distance },
                { x: xOffset + distance, y: yOffset + sideHeight - distance },
                { x: xOffset + sideWidth - distance, y: yOffset + sideHeight - distance }
            ];
            
            // Add middle holes if width or height > 400mm
            if (width >= 400) {
                positions.push({ x: xOffset + sideWidth / 2, y: yOffset + distance });
                positions.push({ x: xOffset + sideWidth / 2, y: yOffset + sideHeight - distance });
            }
            if (height >= 400) {
                positions.push({ x: xOffset + distance, y: yOffset + sideHeight / 2 });
                positions.push({ x: xOffset + sideWidth - distance, y: yOffset + sideHeight / 2 });
            }
        } else if (panelType === 'front' || panelType === 'back') {
            const horizontalDistance = thickness + 8;
            const verticalDistance = thickness + 5;
            positions = [
                { x: xOffset + horizontalDistance, y: yOffset + verticalDistance },
                { x: xOffset + frontBackWidth - horizontalDistance, y: yOffset + verticalDistance },
                { x: xOffset + horizontalDistance, y: yOffset + frontBackHeight - verticalDistance },
                { x: xOffset + frontBackWidth - horizontalDistance, y: yOffset + frontBackHeight - verticalDistance }
            ];
            
            // Add middle holes if length or height > 400mm
            if (length >= 400) {
                positions.push({ x: xOffset + frontBackWidth / 2, y: yOffset + verticalDistance });
                positions.push({ x: xOffset + frontBackWidth / 2, y: yOffset + frontBackHeight - verticalDistance });
            }
            if (height >= 400) {
                positions.push({ x: xOffset + horizontalDistance, y: yOffset + frontBackHeight / 2 });
                positions.push({ x: xOffset + frontBackWidth - horizontalDistance, y: yOffset + frontBackHeight / 2 });
            }
        }
        positions.forEach(pos => {
            svg.appendChild(createCircle(pos.x, pos.y, circleRadius));
        });
    }

    // Create all box sides in the SVG
    const sides = [
        // Bottom
        {
            path: `M ${margin},${margin} h ${topBottomWidth} v ${topBottomLength} h -${topBottomWidth} Z`,
            label: "BOTTOM",
            x: margin + topBottomWidth - 3, // 3mm from the right edge
            y: margin + topBottomLength - 3, // 3mm from the bottom edge
            xOffset: margin,
            yOffset: margin,
            type: 'bottom',
            height: topBottomLength // For font size calculation
        },
        // Front
        {
            path: `M ${margin},${margin + topBottomLength + thickness} h ${frontBackWidth} v ${frontBackHeight} h -${frontBackWidth} Z`,
            label: "FRONT",
            x: margin + frontBackWidth - 3,
            y: margin + topBottomLength + thickness + frontBackHeight - 3,
            xOffset: margin,
            yOffset: margin + topBottomLength + thickness,
            type: 'front',
            height: frontBackHeight // For font size calculation
        },
        // Left
        {
            path: `M ${margin + topBottomWidth + thickness},${margin} h ${sideWidth} v ${sideHeight} h -${sideWidth} Z`,
            label: "LEFT",
            x: margin + topBottomWidth + thickness + sideWidth - 3, // Adjusted position
            y: margin + sideHeight - 3, // 3mm from the bottom edge
            xOffset: margin + topBottomWidth + thickness,
            yOffset: margin,
            type: 'left',
            height: sideHeight // For font size calculation
        },
        // Right
        {
            path: `M ${margin + topBottomWidth + thickness + sideWidth + 10},${margin} h ${sideWidth} v ${sideHeight} h -${sideWidth} Z`,
            label: "RIGHT",
            x: margin + topBottomWidth + thickness + sideWidth + 10 + sideWidth - 3,
            y: margin + sideHeight - 3,
            xOffset: margin + topBottomWidth + thickness + sideWidth + 10,
            yOffset: margin,
            type: 'right',
            height: sideHeight // For font size calculation
        },
        // Back
        {
            path: `M ${margin},${margin + topBottomLength + frontBackHeight + thickness * 2} h ${frontBackWidth} v ${frontBackHeight} h -${frontBackWidth} Z`,
            label: "BACK",
            x: margin + frontBackWidth - 3,
            y: margin + topBottomLength + frontBackHeight + thickness * 2 + frontBackHeight - 3,
            xOffset: margin,
            yOffset: margin + topBottomLength + frontBackHeight + thickness * 2,
            type: 'back',
            height: frontBackHeight // For font size calculation
        },
// Top
{
    path: `M ${margin + topBottomWidth + thickness + sideWidth + 10 + sideWidth + thickness},${margin + topBottomLength + thickness} h ${topBottomWidth} v ${topBottomLength} h -${topBottomWidth} Z`,
    label: "TOP",
    x: margin + topBottomWidth + thickness + sideWidth + 10 + sideWidth + thickness + topBottomWidth - 3,
    y: margin + topBottomLength + thickness + topBottomLength - 3,
    xOffset: margin + topBottomWidth + thickness + sideWidth + 10 + sideWidth + thickness,
    yOffset: margin + topBottomLength + thickness,
    type: 'top',
    height: topBottomLength // For font size calculation
}
        
    ];

    sides.forEach(side => {
        const fontSize = side.height * 0.015;
        svg.appendChild(createPath(side.path));
        svg.appendChild(createText(side.x, side.y, side.label, fontSize));
        addHoles(side.type, side.xOffset, side.yOffset);
    });

   // Generate the SVG content string for the single file
   const svgContent = new XMLSerializer().serializeToString(svg);

   // Create a Blob with the SVG content
   const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });

   // Create a download link and trigger the download of the single file
   const url = URL.createObjectURL(svgBlob);
   const downloadLink = document.createElement('a');
   
   // Create file name based on dimensions
   downloadLink.href = url;
   downloadLink.download = `${width}mm${length}mm${height}mm.svg`;
   
   document.body.appendChild(downloadLink);
   downloadLink.click();
   document.body.removeChild(downloadLink);

   // Clean up the object URL
   URL.revokeObjectURL(url);

   // Clear the output div
   const outputDiv = document.getElementById('output');
   outputDiv.innerHTML = '';
}

// Event listener for the generate button
document.getElementById('generateBox').addEventListener('click', function() {
    const width = parseFloat(document.getElementById('width').value);
    const length = parseFloat(document.getElementById('length').value);
    const height = parseFloat(document.getElementById('height').value);
    const thickness = parseFloat(document.getElementById('thickness').value);

    if (width && length && height && thickness) {
        generateBoxDesign(width, length, height, thickness);
        
        // Clear input fields after generating the box
        document.getElementById('width').value = '';
        document.getElementById('length').value = '';
        document.getElementById('height').value = '';
        document.getElementById('thickness').value = '';
    } else {
        alert('Please fill in all fields with valid numbers');
    }
});
