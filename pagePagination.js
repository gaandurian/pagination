// DONE Aandek mtaa el visible lezem ken deactivated, l'class chnya ki tebda active w ki tebda mech active
// DONE aamel fonction trajaa tableau w lezem zeda les données yet7atou fi fichier json w eli bech yestaamel el fichier y7ot blasstou
// DONE Salla7 el ghalta mtaa ekher page maya9rahech, !nextExists ywalli ekher page maya9rach menha les données

const Nightmare = require('nightmare')
const vo = require('vo')
const jquery = require('jquery')
const fs = require('fs');

function* run(settings) {
  var nightmare = Nightmare()
  currentPage = 0
  nextExists = true
  page = []
  exit = 0

  console.log('Running pagination for settings: \n', settings)

  var targetUrl = settings.targetUrl // houa el lien mtaa el category el bech nfetchiw menha données
  var paginationType = settings.paginationType // showall, disabled, visible
  var productSelector = settings.productSelector // selector mtaa el element eli dima yet3awed
  var linkSelector = settings.linkSelector // houa el selector mtaa el url mtaa el element/produit
  var pageSelector = settings.pageSelector // selector mtaa el boouton mtaa suivant
  var adSelector = settings.adSelector // selector mtaa el bouton eli tsakar el ech'har ken fama ech'har fi site

  onError = (page, name, selector) => {
    page.push(`${name}: '${selector}' does not exist`)
    console.log(`${name}: '${selector}' does not exist`)
    return 2
  }

  yield nightmare
    .viewport(1366, 3000)
    .goto(targetUrl)
    .catch((e) => {
      console.log(e)
      exit = onError(page, 'targetUrl', targetUrl)
    })
  if (yield nightmare.exists(adSelector))
    yield nightmare.click(adSelector)

  if (!(yield nightmare.exists(pageSelector))) {
    exit = onError(page, 'pageSelector', pageSelector)
  }
  if (!(yield nightmare.exists(productSelector))) {
    exit = onError(page, 'productSelector', productSelector)
  }
  if (!(yield nightmare.exists(linkSelector))) {
    exit = onError(page, 'linkSelector', linkSelector)
  }
  if (!(paginationType === 'showall' ||
      paginationType === 'disabled' ||
      paginationType === 'visible')) {
    exit = onError(page, 'paginationType', paginationType)
  }

  if (paginationType === 'visible' || paginationType === 'disabled') {
    if (paginationType === 'visible') nextExists = yield nightmare.visible(pageSelector)
    else if (paginationType === 'disabled') nextExists = yield nightmare.exists(pageSelector)

    while (exit < 2) {
      page.push(yield nightmare
        .evaluate(function(linkSelector, productSelector) {
          let products = []
          $(productSelector).each(function(i, el) {
            let item = {
              index: i,
              // title: $(this).find('h2.title span.name').text().trim(),
              link: $(this).find(linkSelector).attr('href'),
            }
            products.push(item) // push a product to our products array
          })
          return products
        }, linkSelector, productSelector))
      var pageUrl = yield nightmare.url()

      yield nightmare
        .goto(pageUrl)
        .wait(2000)
      if (nextExists) {
        yield nightmare
          .click(pageSelector)
          .wait('body')
      }
      currentPage++
      nextExists = yield nightmare.visible(pageSelector)
      if (!nextExists) exit++
    } // END OF while(exit < 2)
  } // END OF visible and disabled
  else if (paginationType === 'showall') {
    if (yield nightmare.exists(pageSelector))
      yield nightmare.click(pageSelector)

    page.push(yield nightmare
      .evaluate(function(linkSelector, productSelector) {
        let products = []
        $(productSelector).each(function(i, elm) {
          let item = {
            index: i,
            // title: $(this).find('h2.title span.name').text().trim(),
            link: $(this).find(linkSelector).attr('href'),
          }
          products.push(item) // push a product to our products array
        })
        return products
      }, linkSelector, productSelector))
  } // END OF showall
  yield nightmare.end()
  return page
}

module.exports.run = run
