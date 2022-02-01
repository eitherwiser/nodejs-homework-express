/* eslint-disable spaced-comment */

const phoneRegExp =
  /^([+][\d{1}][-\s]?[\d{1}][-\s]?)?([(]?\d{3}[)]?)([-\s]?\d{3})(([-\s]?\d{2}[-\s]?\d{2})|([-\s]?\d{4}))$/;

const emailRegExp =
  /^((?![._-])[a-zA-Z0-9]{0,1}?)+([._-]?[a-zA-Z0-9]{0,64}?)+((?![._-])[a-zA-Z0-9]{1}?)+@((?![._-])[a-zA-Z0-9]{0,1}?)+([._:-]?[a-zA-Z0-9]{0,32}?)+((?![._-])[a-zA-Z0-9]{0,1})+(\.[a-zA-Z0-9]{2,3})$/;

module.exports = {
  phoneRegExp,
  emailRegExp,
};

/* 

*valid phone-numbers:
+99-(999)-999-99-99
+99 (999) 999 99 99
+99 999 999 9999
999 999 99 99
(999)999 9999
9999999999

*email:
___valid:
a.alla_kucher-1984@meta.ua
test@test.com
eon@ihateregex.io
mail@testing.com
aaaaaaaaaa@gmail.com
a_a.a_a@a.a_a-a:a.ua
a@i.ua

___invalid:
aaaa-@aaaa.ua
aaaa.@aaaa.ua
aaaa_@aaaa.ua
aaaa@.aaaa.ua
aaaa@-aaaa.ua
aaaa@_aaaa.ua
_aaaa@aaaa.ua
.aaaa@aaaa.ua
-aaaa@aaaa.ua
aaaa@aaaa-.ua
aaaa@aaaa..ua
aaaa@aaaa_.ua
test@gmail.com mail@test.org
hello@
@test
email@gmail
theproblem@test@gmail.com
mail with@space.com

*Sites for check:
https://regexr.com/
https://www.regextester.com/19
https://regex101.com/
https://ihateregex.io/expr/email

*/
