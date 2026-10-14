const jobs = [
  {id:1,title:'Senior Product Designer',company:'Lateral Studio',logo:'L',logoClass:'logo-orange',location:'New York · Hybrid',workplace:'Hybrid',type:'Full-time',industry:'Design',salary:145,posted:1,description:'Shape simple, powerful tools for people doing their best work.'},
  {id:2,title:'Product Marketing Manager',company:'Evergreen',logo:'E',logoClass:'logo-green',location:'Remote · US / Canada',workplace:'Remote',type:'Full-time',industry:'Marketing',salary:128,posted:2,description:'Tell the story of a more sustainable future.'},
  {id:3,title:'Data Analyst, Growth',company:'Nimbus',logo:'N',logoClass:'',location:'Austin · On-site',workplace:'On-site',type:'Full-time',industry:'Technology',salary:112,posted:4,description:'Turn curious questions into clear, useful decisions.'},
  {id:4,title:'Community Lead',company:'Kinfolk Health',logo:'K',logoClass:'logo-pink',location:'Remote · Worldwide',workplace:'Remote',type:'Contract',industry:'Health',salary:98,posted:6,description:'Build a community around a kinder approach to health.'},
  {id:5,title:'Staff Software Engineer',company:'Orbit',logo:'O',logoClass:'logo-dark',location:'San Francisco · Hybrid',workplace:'Hybrid',type:'Full-time',industry:'Technology',salary:180,posted:7,description:'Build the infrastructure behind the next generation of work.'},
  {id:6,title:'Learning Experience Designer',company:'Brightside',logo:'B',logoClass:'',location:'Boston · Hybrid',workplace:'Hybrid',type:'Part-time',industry:'Education',salary:86,posted:9,description:'Make learning feel human, relevant, and a little surprising.'}
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const store = { get: (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }, set: (key, value) => localStorage.setItem(key, JSON.stringify(value)) };
let savedJobs = store.get('northstarSavedJobs', []);

function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
function openModal(id) { $(`#${id}`).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModals() { $$('.modal-backdrop').forEach(modal => modal.classList.remove('open')); document.body.style.overflow = ''; }
function renderJobs() {
  const keyword = $('#keywordInput').value.trim().toLowerCase();
  const location = $('#locationInput').value.trim().toLowerCase();
  const workplace = $('#workplaceFilter').value;
  const type = $('#typeFilter').value;
  const industry = $('#industryFilter').value;
  const minimumSalary = Number($('#salaryFilter').value);
  const sort = $('#sortSelect').value;
  let filtered = jobs.filter(job => {
    const haystack = `${job.title} ${job.company} ${job.description} ${job.industry}`.toLowerCase();
    return (!keyword || haystack.includes(keyword) || (keyword === 'remote' && job.workplace === 'Remote')) &&
      (!location || job.location.toLowerCase().includes(location) || (location.includes('remote') && job.workplace === 'Remote')) &&
      (!workplace || job.workplace === workplace) && (!type || job.type === type) && (!industry || job.industry === industry) && job.salary >= minimumSalary;
  });
  if (sort === 'salary') filtered.sort((a,b) => b.salary - a.salary);
  if (sort === 'newest') filtered.sort((a,b) => a.posted - b.posted);
  $('#resultCount').textContent = `${filtered.length} ${filtered.length === 1 ? 'role' : 'roles'}`;
  $('#emptyState').classList.toggle('hidden', filtered.length > 0);
  $('#jobList').innerHTML = filtered.map(job => `<article class="job-card"><div class="company-logo ${job.logoClass}">${job.logo}</div><div><h3>${job.title}</h3><div class="job-company">${job.company}</div><div class="job-meta"><span>⌖ ${job.location}</span><span>◷ ${job.type}</span></div><span class="tag">${job.industry}</span></div><div class="job-right"><button class="save-job ${savedJobs.includes(job.id) ? 'saved' : ''}" data-save="${job.id}" aria-label="Save ${job.title}">${savedJobs.includes(job.id) ? '♥' : '♡'}</button><div class="salary">$${job.salary}k<small>estimated salary</small></div></div></article>`).join('');
  $$('[data-save]').forEach(button => button.addEventListener('click', () => {
    const id = Number(button.dataset.save);
    savedJobs = savedJobs.includes(id) ? savedJobs.filter(savedId => savedId !== id) : [...savedJobs, id];
    store.set('northstarSavedJobs', savedJobs); renderJobs(); showToast(savedJobs.includes(id) ? 'Role saved to your shortlist' : 'Role removed from shortlist');
  }));
}
function clearFilters() { $('#keywordInput').value = ''; $('#locationInput').value = ''; $('#workplaceFilter').value = ''; $('#typeFilter').value = ''; $('#industryFilter').value = ''; $('#salaryFilter').value = 0; $('#sortSelect').value = 'featured'; $('#salaryValue').textContent = '$0k+'; renderJobs(); }

$('#searchForm').addEventListener('submit', (event) => { event.preventDefault(); renderJobs(); $('#jobs').scrollIntoView({behavior:'smooth'}); });
$$('[data-keyword]').forEach(button => button.addEventListener('click', () => { $('#keywordInput').value = button.dataset.keyword; renderJobs(); $('#jobs').scrollIntoView({behavior:'smooth'}); }));
['workplaceFilter','typeFilter','industryFilter','salaryFilter','sortSelect'].forEach(id => $(`#${id}`).addEventListener('input', () => { if (id === 'salaryFilter') $('#salaryValue').textContent = `$${$('#salaryFilter').value}k+`; renderJobs(); }));
$('#clearFilters').addEventListener('click', clearFilters); $('#emptyClear').addEventListener('click', clearFilters);
$('#mobileFilterToggle').addEventListener('click', () => $('.filters').classList.toggle('mobile-open'));
$('#alertButton').addEventListener('click', () => { $('#alertForm').scrollIntoView({behavior:'smooth', block:'center'}); $('#alertEmail').focus(); });
$$('[data-modal]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.modal)));
$$('[data-close]').forEach(button => button.addEventListener('click', closeModals));
$$('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', (event) => { if (event.target === backdrop) closeModals(); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModals(); });

$('#profileForm').addEventListener('submit', (event) => {
  event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); store.set('northstarProfile', data);
  $('#profileButton').classList.add('hidden'); const chip = $('#profileChip'); chip.textContent = `Hi, ${data.name.split(' ')[0]} ↗`; chip.classList.remove('hidden'); closeModals(); showToast('Your profile is ready to discover better-fit roles'); event.target.reset();
});
$('#employerForm').addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); store.set('northstarEmployer', data); closeModals(); showToast(`${data.company} is now on Northstar`); event.target.reset(); });
$('#reviewForm').addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); const reviews = store.get('northstarReviews', []); store.set('northstarReviews', [...reviews, data]); closeModals(); showToast('Candidate review published — thank you'); event.target.reset(); });
$('#alertForm').addEventListener('submit', (event) => { event.preventDefault(); const data = {email: $('#alertEmail').value, role: $('#alertRole').value}; store.set('northstarAlert', data); $('#alertDot').style.display = 'block'; showToast(`Weekly ${data.role} alerts are on`); event.target.reset(); });

const profile = store.get('northstarProfile', null);
if (profile) { $('#profileButton').classList.add('hidden'); const chip = $('#profileChip'); chip.textContent = `Hi, ${profile.name.split(' ')[0]} ↗`; chip.classList.remove('hidden'); }
if (store.get('northstarAlert', null)) $('#alertDot').style.display = 'block';
renderJobs();
