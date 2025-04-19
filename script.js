let language = localStorage.getItem('language') || 'zh';
const labels = {
  zh: ["HTN", "收缩压 (mmHg)", "舒张压 (mmHg)", "nRAAS", "eGFR (ml/min/1.73m²)", "BMI", "年龄（岁）"],
  en: ["HTN", "SBP (mmHg)", "DBP (mmHg)", "nRAAS", "eGFR (ml/min/1.73m²)", "BMI", "Age (year)"]
};
const yesNoOptions = {
  zh: ['否', '是'],
  en: ['No', 'Yes']
};
const helpContent = {
  zh: "HTN：高血压；eGFR：估算肾小球滤过率；nRAAS：新型肾素-血管紧张素-醛固酮系统；BMI：体质指数。",
  en: "HTN: Hypertension; SBP: Systolic Blood Pressure; DBP: Diastolic Blood Pressure; eGFR: Estimated Glomerular Filtration Rate; nRAAS: Novel Renin-Angiotensin-Aldosterone System; BMI: Body Mass Index."
};

const numbers = Array(7).fill('');

function onLangChange() {
  language = document.getElementById('langSelector').value;
  localStorage.setItem('language', language);
  updateLabels();
}

function onHelpTap() {
  alert(helpContent[language]);
}

function onPickerChange(index) {
  const picker = document.getElementById(`picker${index}`);
  const value = picker.value;
  numbers[index] = value;
}

function onInput(index) {
  const input = document.getElementById(`input${index}`);
  let value = input.value;

  // 验证输入
  if (index === 1 || index === 2 || index === 5) { // 收缩压、舒张压、BMI
    value = parseFloat(value);
    if (value <= 0) {
      alert(language === 'zh' ? "请输入正数" : "Please enter a positive number");
      input.value = '';
      numbers[index] = '';
      return;
    }
  } else if (index === 4) { // eGFR
    value = parseFloat(value);
    if (value <= 0) {
      alert(language === 'zh' ? "请输入正数" : "Please enter a positive number");
      input.value = '';
      numbers[index] = '';
      return;
    }
  } else if (index === 6) { // 年龄
    // 严格验证正整数
    const numericValue = parseFloat(value);
    if (
      isNaN(numericValue) ||  // 非数字
      numericValue <= 0 ||    // 零或负数
      numericValue % 1 !== 0 // 包含小数
    ) {
      alert(language === 'zh' ? "请输入正整数" : "Please enter a positive integer");
      input.value = '';
      numbers[index] = '';
      return;
    }
    value = numericValue;
  }

  numbers[index] = value;
}

function updateLabels() {
  // 更新输入标签
  for (let i = 0; i < 7; i++) {
    document.getElementById(`label${i}`).innerText = labels[language][i];
  }

  // 更新选择器选项
  const pleaseSelectText = language === 'zh' ? '请选择' : 'Please select';
  document.querySelectorAll('select[id^="picker"] option[value=""]').forEach(option => {
    option.text = pleaseSelectText;
  });

  // 更新是/否选项
  for (let i = 0; i < 2; i++) {
    const picker = document.getElementById(`picker${i * 3}`);
    picker.options[1].text = yesNoOptions[language][1];
    picker.options[2].text = yesNoOptions[language][0];
  }

  // 更新按钮文本
  document.getElementById('submitButton').innerText = language === 'zh' ? '提交' : 'Submit';
  document.getElementById('helpButton').innerText = language === 'zh' ? '帮助' : 'Help';

  // 同步语言选择器状态
  document.getElementById('langSelector').value = language;
}

function onSubmit() {
  const numbersParsed = numbers.map(num => parseFloat(num));
  if (numbersParsed.some(isNaN)) {
    alert(language === 'zh' ? "请输入有效的数字" : "Please enter valid numbers");
    return;
  }

  // 存储数据和语言设置
  localStorage.setItem('inputData', JSON.stringify(numbersParsed));
  localStorage.setItem('language', language);

  // 跳转到结果页面
  window.location.href = 'result.html';
}

// 在页面加载时初始化
document.getElementById('langSelector').value = language;
updateLabels();