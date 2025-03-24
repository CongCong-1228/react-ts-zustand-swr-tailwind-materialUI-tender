/**
 * 将 BBCode 格式的文本转换为 HTML，同时保留已有的 HTML 标签
 * @param mixed BBCode 和 HTML 混合的文本
 * @param preserveNewlines 是否保留换行符，默认为 false
 * @returns 转换后的 HTML 字符串
 */
export function parseBBCodeToHTML(
  mixed: string,
  preserveNewlines: boolean = false,
): string {
  if (!mixed) return '';

  // 临时替换 HTML 标签，避免被 BBCode 解析过程干扰
  const htmlTags: string[] = [];
  let htmlIndex = 0;

  // 先保存所有 HTML 标签
  let preservedHTML = mixed.replace(/<[^>]+>|<\/[^>]+>/g, (match) => {
    const placeholder = `__HTML_PLACEHOLDER_${htmlIndex}__`;
    htmlTags.push(match);
    htmlIndex++;
    return placeholder;
  });

  // 处理 BBCode
  let html = preservedHTML;

  // 替换保留换行符，默认为 false，除非明确指定为 true
  if (preserveNewlines) {
    html = html.replace(/\n/g, '<br />');
  }

  // 处理 [br] 标签，将其替换为空字符串
  html = html.replace(/\[br\]/gi, '');

  // 替换基础 BBCode 标签
  const bbMap: { [key: string]: { openTag: string; closeTag: string } } = {
    b: { openTag: '<strong>', closeTag: '</strong>' },
    i: { openTag: '<em>', closeTag: '</em>' },
    u: { openTag: '<u>', closeTag: '</u>' },
    s: { openTag: '<strike>', closeTag: '</strike>' },
    code: { openTag: '<code>', closeTag: '</code>' },
    quote: { openTag: '<blockquote>', closeTag: '</blockquote>' },
    center: { openTag: '<div style="text-align:center;">', closeTag: '</div>' },
    right: { openTag: '<div style="text-align:right;">', closeTag: '</div>' },
    left: { openTag: '<div style="text-align:left;">', closeTag: '</div>' },
  };

  // 处理基础标签
  Object.keys(bbMap).forEach((tag) => {
    const pattern = new RegExp(`\\[${tag}\\](.*?)\\[\\/${tag}\\]`, 'gis');
    html = html.replace(
      pattern,
      `${bbMap[tag].openTag}$1${bbMap[tag].closeTag}`,
    );
  });

  // 处理带属性的标签

  // 处理颜色标签: [color=#333333]text[/color] 或 [color= #333333]text[/color]
  html = html.replace(
    /\[color=\s*(#[\da-fA-F]{6}|#[\da-fA-F]{3}|[a-zA-Z]+)(;[^\]]*)?](.*?)\[\/color]/gis,
    '<span style="color:$1;">$3</span>',
  );

  // 处理字体标签: [font=Arial]text[/font] 或 [font= Arial]text[/font]
  html = html.replace(
    /\[font=\s*([^;]*)(?:;[^\]]*)?](.*?)\[\/font]/gis,
    '<span style="font-family:$1;">$2</span>',
  );

  // 处理字体大小标签: [size=15px]text[/size] 或 [size= 15px]text[/size]
  html = html.replace(
    /\[size=\s*(\d+(?:px|pt|em)?)](.*?)\[\/size]/gis,
    '<span style="font-size:$1;">$2</span>',
  );

  // 处理链接标签: [url=https://example.com]link text[/url] 或 [url= https://example.com]link text[/url]
  html = html.replace(
    /\[url=\s*(.*?)](.*?)\[\/url]/gis,
    '<a href="$1" target="_blank">$2</a>',
  );

  // 处理简单链接标签: [url]https://example.com[/url]
  html = html.replace(
    /\[url](.*?)\[\/url]/gis,
    '<a href="$1" target="_blank">$1</a>',
  );

  // 处理图片标签: [img]https://example.com/image.jpg[/img]
  html = html.replace(/\[img](.*?)\[\/img]/gis, '<img src="$1" alt="" />');

  // 处理列表标签
  html = html.replace(/\[list](.*?)\[\/list]/gis, '<ul>$1</ul>');

  html = html.replace(/\[\*](.*?)(?=\[\*]|\[\/list])/gis, '<li>$1</li>');

  // 处理复杂情况：带有多个属性的格式，如 [color=#333333; font-family: 微软雅黑; font-size: 13px]
  html = html.replace(
    /\[color=\s*(#[\da-fA-F]{6}|#[\da-fA-F]{3}|[a-zA-Z]+);\s*font-family:\s*([^;]+);\s*font-size:\s*(\d+(?:px|pt|em)?)](.*?)\[\/color]/gis,
    '<span style="color:$1; font-family:$2; font-size:$3;">$4</span>',
  );

  // 恢复 HTML 标签
  for (let i = 0; i < htmlTags.length; i++) {
    html = html.replace(`__HTML_PLACEHOLDER_${i}__`, htmlTags[i]);
  }

  // 处理表格 - 为没有明确边框属性的表格添加默认边框
  html = html.replace(
    /<table(?![^>]*border=)/gi,
    '<table border="1" style="border-collapse: collapse;"',
  );

  // 处理表格单元格 - 为所有 td 和 th 添加边框样式（如果尚未存在）
  html = html.replace(
    /<(td|th)(?![^>]*style=)/gi,
    '<$1 style="border: 1px solid #ddd; padding: 8px;"',
  );
  html = html.replace(
    /<(td|th)([^>]*?)style="([^"]*)"/gi,
    function (tag, attrs, style) {
      if (style.indexOf('border') === -1) {
        style += '; border: 1px solid #ddd;';
      }
      if (style.indexOf('padding') === -1) {
        style += '; padding: 8px;';
      }
      return `<${tag}${attrs}style="${style}"`;
    },
  );

  return html;
}
