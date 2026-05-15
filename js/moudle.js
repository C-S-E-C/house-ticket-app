// 原生 JavaScript 生成二维码
var QR;
(function() {
    // QR 码纠错等级
    const ErrorCorrectLevel = {
        L: 0,  // 7%
        M: 1,  // 15%
        Q: 2,  // 25%
        H: 3   // 30%
    };

    // 辅助函数：获取二维码矩阵数据（简化版，仅支持数字和字母）
    function getQRCodeMatrix(text, errorCorrectLevel = ErrorCorrectLevel.M) {
        // 这里使用一个简化的 QR 码生成逻辑
        // 实际生产环境建议使用成熟的库，以下是基础演示
        
        // 为了演示，返回一个简单的 21x21 矩阵（版本1）
        const size = 21;
        const matrix = Array(size).fill().map(() => Array(size).fill(0));
        
        // 添加位置探测图形（左上角）
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (i === 0 || i === 6 || j === 0 || j === 6) {
                    matrix[i][j] = 1;
                } else if ((i >= 2 && i <= 4) && (j >= 2 && j <= 4)) {
                    matrix[i][j] = 1;
                } else {
                    matrix[i][j] = 0;
                }
            }
        }
        
        // 添加位置探测图形（右上角）
        for (let i = 0; i < 7; i++) {
            for (let j = size - 7; j < size; j++) {
                if (i === 0 || i === 6 || j === size - 7 || j === size - 1) {
                    matrix[i][j] = 1;
                } else if ((i >= 2 && i <= 4) && (j >= size - 5 && j <= size - 3)) {
                    matrix[i][j] = 1;
                } else {
                    matrix[i][j] = 0;
                }
            }
        }
        
        // 添加位置探测图形（左下角）
        for (let i = size - 7; i < size; i++) {
            for (let j = 0; j < 7; j++) {
                if (i === size - 7 || i === size - 1 || j === 0 || j === 6) {
                    matrix[i][j] = 1;
                } else if ((i >= size - 5 && i <= size - 3) && (j >= 2 && j <= 4)) {
                    matrix[i][j] = 1;
                } else {
                    matrix[i][j] = 0;
                }
            }
        }
        
        // 添加时序图形（水平）
        for (let i = 8; i < size - 8; i++) {
            matrix[6][i] = (i % 2 === 0) ? 1 : 0;
        }
        
        // 添加时序图形（垂直）
        for (let i = 8; i < size - 8; i++) {
            matrix[i][6] = (i % 2 === 0) ? 1 : 0;
        }
        
        // 简单编码文本数据（实际应该按规范编码）
        // 将文本的二进制表示填充到矩阵中
        let binaryStr = '';
        for (let i = 0; i < text.length; i++) {
            let charCode = text.charCodeAt(i);
            let binary = charCode.toString(2).padStart(8, '0');
            binaryStr += binary;
        }
        
        // 填充数据到矩阵（跳过功能图形区域）
        let dataIndex = 0;
        let direction = 1; // 1: 向上, -1: 向下
        let col = size - 1;
        
        for (let row = size - 1; row >= 0; row -= 2) {
            if (col === 6) col--;
            for (let i = 0; i < 2; i++) {
                let currentCol = col - i;
                let currentRow = (direction === 1) ? row : (size - 1 - row);
                
                if (currentRow >= 0 && currentRow < size && currentCol >= 0 && currentCol < size) {
                    // 跳过功能图形区域
                    if (!((currentRow < 7 && currentCol < 7) ||
                          (currentRow < 7 && currentCol >= size - 7) ||
                          (currentRow >= size - 7 && currentCol < 7) ||
                          currentRow === 6 || currentCol === 6)) {
                        if (dataIndex < binaryStr.length) {
                            matrix[currentRow][currentCol] = parseInt(binaryStr[dataIndex]) || 0;
                            dataIndex++;
                        }
                    }
                }
            }
            direction *= -1;
            if (col === 0) break;
            col--;
        }
        
        return matrix;
    }

    // 将矩阵渲染为 Canvas
    function renderQRCodeToCanvas(text, canvas, size = 300, errorLevel = ErrorCorrectLevel.M) {
        const matrix = getQRCodeMatrix(text, errorLevel);
        const moduleSize = size / matrix.length;
        
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // 白色背景
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        
        // 绘制黑色模块
        ctx.fillStyle = '#000000';
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === 1) {
                    ctx.fillRect(
                        col * moduleSize,
                        row * moduleSize,
                        moduleSize,
                        moduleSize
                    );
                }
            }
        }
        
        return canvas;
    }

    // 在指定容器中生成二维码图片
    function generateQRCode(containerId, text, size = 200, errorLevel = ErrorCorrectLevel.M) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('容器不存在');
            return null;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 创建 canvas 元素
        const canvas = document.createElement('canvas');
        renderQRCodeToCanvas(text, canvas, size, errorLevel);
        
        container.appendChild(canvas);
        return canvas;
    }

    // 在指定容器中生成二维码（返回img元素）
    function generateQRCodeAsImage(containerId, text, size = 200, errorLevel = ErrorCorrectLevel.M) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('容器不存在');
            return null;
        }
        
        const canvas = document.createElement('canvas');
        renderQRCodeToCanvas(text, canvas, size, errorLevel);
        
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.width = size;
        img.height = size;
        img.alt = 'QR Code';
        
        container.innerHTML = '';
        container.appendChild(img);
        
        return img;
    }

    // 导出函数（挂载到 window 对象）
    QR = {
        generate: generateQRCode,
        generateAsImage: generateQRCodeAsImage,
        renderToCanvas: renderQRCodeToCanvas,
        ErrorLevel: ErrorCorrectLevel
    };
    
    // 使用示例：
    // QR.generate('qrcode-container', 'https://www.example.com', 250);
})();

export { QR };
// ============= 使用示例 =============
// 1. 在 HTML 中需要一个容器元素：
//    <div id="qrcode"></div>
//    
// 2. 调用生成二维码：
//    QR.generate('qrcode', 'https://www.baidu.com', 250);
//
// 3. 生成图片格式：
//    QR.generateAsImage('qrcode', 'Hello QR Code', 200);