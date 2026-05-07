const { test, expect, beforeEach, describe } = require('@playwright/test')
const blog = require('../../blogilista/models/blog')
const { debug } = require('console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'log in to application' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').nth(0).fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').nth(0).fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').nth(0).fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test blog Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'show details' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('remove button is visible for the user who created the blog', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'show details' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('a blog can be deleted by user who created it', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()
      
      await page.getByRole('button', { name: 'show details' }).click()
      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Test blog Author')).not.toBeVisible()
    })
    
    test('a blog cannot be deleted by another user', async ({ page, request }) => {
      // create a blog as mluukkai
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('url.fi')
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
      await page.getByRole('textbox').nth(0).fill('kayttaja')
      await page.getByRole('textbox').nth(1).fill('123456')
      await page.getByRole('button', { name: 'login' }).click()

      // Check remove button is not shown
      await page.getByRole('button', { name: 'show details' }).click()
      const removeButton = page.getByRole('button', { name: 'remove' })
      await expect(removeButton).not.toBeVisible()
    })
    
    test('blogs get ordered by likes', async ({ page }) => {
      // Create two blogs
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Blog1')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Blog2')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('url.fi')
      await page.getByRole('button', { name: 'create' }).click()

      const blog1 = page.locator('.blog', { hasText: 'Blog1 Author' })
      const blog2 = page.locator('.blog', { hasText: 'Blog2 Author' })

      // Like Blog2 twice and verify it becomes first
      await blog2.getByRole('button', { name: 'show details' }).click()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2).toContainText('1 likes')
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2).toContainText('2 likes')

      await expect(page.locator('.blog').nth(0)).toContainText('Blog2 Author')

      // Like Blog1 three times and verify it becomes first again
      await blog1.getByRole('button', { name: 'show details' }).click()
      await blog1.getByRole('button', { name: 'like' }).click()
      await expect(blog1).toContainText('1 likes')
      await blog1.getByRole('button', { name: 'like' }).click()
      await expect(blog1).toContainText('2 likes')
      await blog1.getByRole('button', { name: 'like' }).click()
      await expect(blog1).toContainText('3 likes')

      await expect(page.locator('.blog').nth(0)).toContainText('Blog1 Author')
    })
  })
})
