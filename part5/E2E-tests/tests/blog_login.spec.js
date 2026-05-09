const { test, expect, beforeEach, describe } = require('@playwright/test')
const blog = require('../../blogilista/models/blog')
const { debug } = require('console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { // Example data from the course
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.locator('input[name="Username"]').fill('mluukkai')
      await page.locator('input[name="Password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('login successful')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.locator('input[name="Username"]').fill('mluukkai')
      await page.locator('input[name="Password"]').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      const res = await request.post('http://localhost:3003/api/login', {
        data: { username: 'mluukkai', password: 'salainen' }
      })
      const user = await res.json()
      await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' })
      await page.evaluate((u) => {
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(u))
      }, user)
      await page.reload()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Author')
      await page.locator('input[name="Url"]').fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByRole('link', { name: 'Test blog Author' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // create blog
      await page.getByRole('link', { name: 'create new' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Author')
      await page.locator('input[name="Url"]').fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      // open blog view and like
      await page.getByRole('link', { name: 'Test blog Author' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('remove button is visible for the user who created the blog', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Author')
      await page.locator('input[name="Url"]').fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: 'Test blog Author' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('a blog can be deleted by user who created it', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Author')
      await page.locator('input[name="Url"]').fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: 'Test blog Author' }).click()
      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', { name: 'Test blog Author' })).not.toBeVisible()
    })
    
    test('a blog cannot be deleted by another user', async ({ page, request }) => {
      // create a blog as mluukkai
      await page.getByRole('link', { name: 'create new' }).click()
      await page.locator('input[name="Title"]').fill('Test blog')
      await page.locator('input[name="Author"]').fill('Author')
      await page.locator('input[name="Url"]').fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      // Create new user and log in
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Salee Joku',
          username: 'kayttaja',
          password: '123456'
        }
      })
      await page.goto('http://localhost:5173/login')
      await page.locator('input[name="Username"]').fill('kayttaja')
      await page.locator('input[name="Password"]').fill('123456')
      await page.getByRole('button', { name: 'login' }).click()

      // Check remove button is not shown in blog view
      await page.getByRole('link', { name: 'Test blog Author' }).click()
      const removeButton = page.getByRole('button', { name: 'remove' })
      await expect(removeButton).not.toBeVisible()
    })
  })
})
