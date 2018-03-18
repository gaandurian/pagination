const pagination = require('./pagePagination.js')
const vo = require('vo');
const fs = require('fs');
const asyncLoop = require('node-async-loop');
var settingsArr = [{
  targetUrl:        'https://www.jumia.com.tn/ordinateurs-portables/',
  // houa el lien mtaa el category el bech nfetchiw menha données
  paginationType:   'disabled',
  // showall, disabled, visible
  productSelector:  '.sku',
  // selector mtaa el element eli dima yet3awed
  linkSelector:     'a.link',
  // houa el selector mtaa el url mtaa el element/produit
  pageSelector:     'section.pagination ul li a[title="Suivant"]',
  // selector mtaa el boouton mtaa suivant
  adSelector:       '.mfp-close'
  // selector mtaa el bouton eli tsakar el ech'har ken fama ech'har fi site
}, {
  targetUrl:        'http://www.mytek.tn/13-pc-portable',
  paginationType:   'showall',
  productSelector:  '.ajax_block_product',
  linkSelector:     'a.product-name',
  pageSelector:     '.showall button',
  adSelector:       '.noAdToClose'
}]
var i = -1
asyncLoop(settingsArr, (item, next) => {
  var run = pagination.run(item)
  i++
  vo(run)(function(err, result) { // fonction tkhadam generator function mte3na
  }, item).catch((err) => {
    console.log(err)
    return;
  }).then((res) => {
    // res fiha tableau fih les lien w titre mtaa kol produit fl paget lkol
    console.log(JSON.stringify(res, undefined, 2))
    fs.writeFileSync(`pagination_${i}.json`, JSON.stringify(res, undefined, 3))
    next()
  })
})
