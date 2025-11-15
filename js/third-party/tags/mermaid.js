/* global NexT, CONFIG, mermaid */

document.addEventListener('page:loaded', () => {
  const mermaidElements = document.querySelectorAll('pre > .mermaid, pre.mermaid');
  if (mermaidElements.length) {
    NexT.utils.getScript(CONFIG.mermaid.js, {
      condition: window.mermaid
    }).then(() => {
      mermaidElements.forEach(element => {
        const box = document.createElement('div');
        box.className = 'code-container';
        const newElement = document.createElement('div');
        newElement.innerHTML = element.innerHTML;
        newElement.className = 'mermaid';
        box.appendChild(newElement);
        if (CONFIG.copycode.enable) {
          NexT.utils.registerCopyButton(box, box, element.textContent);
        }
        // Handle both <pre class="mermaid"> and <pre><code class="mermaid">
        const targetElement = element.tagName === 'PRE' ? element : element.parentNode;
        targetElement.parentNode.replaceChild(box, targetElement);
      });
      mermaid.initialize({
        theme    : CONFIG.darkmode && window.matchMedia('(prefers-color-scheme: dark)').matches ? CONFIG.mermaid.theme.dark : CONFIG.mermaid.theme.light,
        logLevel : 4,
        flowchart: { curve: 'linear' },
        gantt    : { axisFormat: '%m/%d/%Y' },
        sequence : { actorMargin: 50 }
      });
      mermaid.run();
    });
  }
});
