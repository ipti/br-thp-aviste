export function isMinorFromBirthday(birthday?: string): boolean {
  if (!birthday || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthday)) return true;
  const [d, m, y] = birthday.split('/').map(Number);
  const birth = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const mo = today.getMonth() - birth.getMonth();
  if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--;
  return age < 18;
}
