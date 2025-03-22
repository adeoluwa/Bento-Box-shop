export function serializePhoneNumber(number: string): string {
  if(number.startsWith('0')) number = number.replace('0', '+234');
  else if (!number.startsWith('+')) number = '+' + number;

  return number;
}