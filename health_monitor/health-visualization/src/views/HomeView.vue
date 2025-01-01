<template>
  <div v-html="htmlContent"></div>
</template>

<script>
export default {
  name: 'DynamicHtmlView',
  data() {
    return {
      htmlContent: '',
    };
  },
  mounted() {
    fetch('/index.html') // 假设 HTML 文件名为 static.html，并放在 public 目录下
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(html => {
        this.htmlContent = html;
      })
      .catch(error => console.error('Error loading HTML:', error));
  },
};
</script>