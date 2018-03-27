const pagination = require('./pagePagination.js')
const vo = require('vo');
const fs = require('fs');
const asyncLoop = require('node-async-loop');
var settingsArr = [{
  targetUrl: 'https://www.jumia.com.tn/ordinateurs-portables/',
  // houa el lien mtaa el category el bech nfetchiw menha données
  paginationType: 'isabled',
  // showall, disabled, visible
  productSelector: '.sku',
  // selector mtaa el element eli dima yet3awed
  linkSelector: 'a.link',
  // houa el selector mtaa el url mtaa el element/produit
  pageSelector: 'ection.pagination ul li a[title="Suivant"]',
  // selector mtaa el boouton mtaa suivant
  adSelector: '.mfp-close'
  // selector mtaa el bouton eli tsakar el ech'har ken fama ech'har fi site
}, {
  targetUrl: 'http://www.mytek.tn/13-pc-portable',
  paginationType: 'showall',
  productSelector: '.ajax_block_product',
  linkSelector: 'a.product-name',
  pageSelector: '.showall button',
  adSelector: '.noAdToClose'
}, {
  targetUrl: 'https://www.wiki.tn/pc-portable-120.html',
  paginationType: 'showall',
  productSelector: 'div.ajax_block_product div.product-container',
  linkSelector: 'a.product-name',
  pageSelector: '.showall button',
  adSelector: '.noAdToClose'
}, {
  targetUrl: 'https://www.wiki.tn/telephones-portables-257.html',
  paginationType: 'showall',
  productSelector: 'div.ajax_block_product div.product-container',
  linkSelector: 'a.product-name',
  pageSelector: '.showall button',
  adSelector: '.noAdToClose'
}]

var i = -1
asyncLoop(settingsArr, (item, next) => {
  var run = pagination.run(item)
  i++
  vo(run)(function(err, result) { // fonction tkhadam generator function mte3na
  }, item).catch((err) => {
    console.log(err)
    next()
  }).then((res) => {
    // res fiha tableau fih les lien mtaa kol produit fl paget lkol
    var data = JSON.stringify(res, undefined, 3)
    console.log(JSON.stringify(res, undefined, 2))
    fs.writeFileSync(`pagination_${i}.json`, data, 'utf-8')
  next()
  })

})
