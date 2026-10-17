'use strict';
(() => {
  const product = window.GATHER_CATALOG;
  const team = product.plans.find(item => item.id === 'team');
  const minimum = team.minimumSeats;
  const query = new URLSearchParams(location.search);
  const validBilling = value => value === 'monthly' ? 'monthly' : 'annual';
  const validSeats = value => Number.isInteger(Number(value)) && Number(value) >= minimum && Number.isSafeInteger(Number(value) * team.monthlyPerSeat * 12) ? Number(value) : minimum;
  let billing = validBilling(query.get('billing'));
  let seats = validSeats(query.get('seats'));
  const plan = ['free', 'team'].includes(query.get('plan')) ? query.get('plan') : null;
  const money = value => `¥${value.toLocaleString('zh-CN')}`;
  const context = () => new URLSearchParams({ plan: 'team', billing, seats: String(seats) });
  async function loadProduct() {
    if (!product?.sample?.feedback) throw new Error('Product material unavailable');
    return product;
  }
  function updatePricing() {
    const rate = billing === 'annual' ? team.annualMonthlyPerSeat : team.monthlyPerSeat;
    document.querySelectorAll('[data-billing]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.billing === billing)));
    document.querySelector('#team-price').textContent = money(rate);
    document.querySelector('#billing-detail').textContent = billing === 'annual' ? `按年支付，最少 ${minimum} 个席位` : `按月支付，最少 ${minimum} 个席位`;
    document.querySelector('#total').textContent = money(rate * seats * (billing === 'annual' ? 12 : 1));
    document.querySelector('#total-unit').textContent = billing === 'annual' ? '/ 年，一次支付' : '/ 月，每月支付';
    document.querySelector('#total-math').textContent = `${rate} × ${seats} 席位${billing === 'annual' ? ' × 12 个月' : ''}`;
    document.querySelectorAll('[data-plan="team"]').forEach(link => { link.href = `/login/?${context()}`; });
    const next = new URL(location.href);
    next.search = new URLSearchParams({ billing, seats: String(seats) }).toString();
    history.replaceState(null, '', next);
  }
  if (document.body.dataset.page === 'pricing') {
    const input = document.querySelector('#seats');
    input.value = seats;
    updatePricing();
    document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => { billing = button.dataset.billing; updatePricing(); handleSeats(); }));
    function handleSeats() {
      const value = Number(input.value);
      const valid = input.value !== '' && input.validity.valid && Number.isSafeInteger(value * team.monthlyPerSeat * 12);
      const links = document.querySelectorAll('[data-plan="team"]');
      input.setAttribute('aria-invalid', String(!valid));
      document.querySelector('#seats-error').textContent = valid ? '' : `请输入至少 ${minimum} 的整数席位数。`;
      links.forEach(link => link.setAttribute('aria-disabled', String(!valid)));
      if (valid) {
        seats = value;
        updatePricing();
      } else {
        links.forEach(link => link.removeAttribute('href'));
        document.querySelector('#total').textContent = '—';
        document.querySelector('#total-unit').textContent = '填写有效人数后计算';
        document.querySelector('#total-math').textContent = '';
      }
    }
    input.addEventListener('input', handleSeats);
    document.querySelectorAll('[data-plan="team"]').forEach(link => link.addEventListener('click', event => {
      if (event.currentTarget.getAttribute('aria-disabled') === 'true') { event.preventDefault(); input.focus(); }
    }));
  }
  if (document.body.dataset.page === 'login') {
    if (plan) {
      document.querySelector('#selected-plan').hidden = false;
      document.querySelector('#selected-plan-title').textContent = plan === 'free' ? 'Free · 免费工作区' : `Team · ${seats} 个席位 · ${billing === 'annual' ? '年付' : '月付'}`;
      document.querySelector('#selected-plan-note').textContent = plan === 'free' ? '最多 3 位成员，100 条反馈' : `${money((billing === 'annual' ? team.annualMonthlyPerSeat * 12 : team.monthlyPerSeat) * seats)} / ${billing === 'annual' ? '年，一次支付' : '月，每月支付'}`;
      const returnToPricing = plan === 'free' ? '/pricing/' : `/pricing/?${context()}`;
      document.querySelector('#edit-plan').href = returnToPricing;
      document.querySelector('.login-price-link').href = returnToPricing;
    }
    const form = document.querySelector('#login-form');
    const status = document.querySelector('#login-status');
    form.addEventListener('submit', event => {
      event.preventDefault();
      status.textContent = '邮箱登录尚未接入，未发送登录链接。你可以直接体验下方的示例工作区。';
    });
    document.querySelector('#email').addEventListener('input', () => { status.textContent = ''; });
  }
  const dialog = document.querySelector('#demo');
  let opener;
  let selected = 0;
  const voted = new Set();
  function renderDemo() {
    const feedback = product.sample.feedback;
    document.querySelector('.demo-list').replaceChildren(...feedback.map((item, index) => {
      const button = document.createElement('button');
      button.className = 'feedback-choice';
      button.setAttribute('aria-pressed', String(index === selected));
      button.innerHTML = `<span class="feedback-votes">${item.votes + (voted.has(index) ? 1 : 0)}</span><span>${item.title}<small>${item.source} · ${item.tag}</small></span>`;
      button.addEventListener('click', () => { selected = index; renderDemo(); document.querySelectorAll('.feedback-choice')[index].focus(); });
      return button;
    }));
    const item = feedback[selected];
    const detail = document.querySelector('.demo-detail');
    detail.innerHTML = `<span class="status-chip">${item.status}</span><h3>${item.title}</h3><p>${selected === 0 ? product.sample.detail : `来自${item.source}的反馈，整理在「${item.tag}」主题下。`}</p><p>当前支持：${item.votes + (voted.has(selected) ? 1 : 0)} 票</p><button class="button secondary" id="vote" aria-pressed="${voted.has(selected)}">${voted.has(selected) ? '已支持 · 点击撤回' : '支持这条反馈'} <span aria-hidden="true">↑</span></button>`;
    detail.querySelector('#vote').addEventListener('click', () => { voted.has(selected) ? voted.delete(selected) : voted.add(selected); renderDemo(); document.querySelector('#vote').focus(); });
  }
  document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', async () => {
    opener = button;
    try {
      await loadProduct();
      renderDemo();
      document.querySelector('#demo-plan').textContent = plan === 'team' ? `方案意向：Team · ${seats} 个席位 · ${billing === 'annual' ? '年付' : '月付'}。演示不会创建订阅或收款。` : '无需账号，使用示例数据；不会创建订阅或收款。';
      dialog.showModal();
      document.body.classList.add('modal-open');
    } catch (error) {
      document.querySelector('.demo-intro').textContent = '产品示例暂时无法加载，请刷新页面后重试。';
      dialog.showModal();
    }
  }));
  document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });
})();
